import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Search, MoreVertical } from "lucide-react";
import { debounce } from "lodash";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import TaxRateByHSDialog from "./TaxRateByHSDialog";
import DeleteHSCodeConfirmDIalog from "./DeleteHSCodeConfirmDIalog";

// A simple tree node renderer with lazy children loading via backend API
export default function HsTree({ treeData, selectedCode, setHScode, showSearch = true }) {
  const [openMenuCode, setOpenMenuCode] = useState(null);
  const [dialogTaxOpen, setDialogTaxOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [dialogHSCode, setDialogHSCode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());

  const handleTaxDialogOpen = (code) => {
    setOpenMenuCode(null);
    setDialogHSCode(code);
    setDialogTaxOpen(true);
  }

  const handleDeleteDialogOpen = (code) => {
    setOpenMenuCode(null);
    setDialogHSCode(code);
    setDialogDeleteOpen(true);
  }

  // Normalize incoming nodes: support either `code` or `hsCode`, and various children keys
  const roots = useMemo(() => {
    if (!treeData) return [];
    const src = Array.isArray(treeData) ? treeData : [treeData];
    const mapNode = (n) => {
      const code = n.code ?? n.hsCode ?? n.id;
      const parentCode = n.parentCode ?? n.parentHsCode ?? n.parent_id ?? n.parentId;
      const rawChildren = n.children ?? n.childrens ?? n.childs ?? [];
      const children = Array.isArray(rawChildren) ? rawChildren.map(mapNode) : [];
      return { ...n, code, parentCode, children };
    };
    return src.map(mapNode);
  }, [treeData]);

  // Flatten the hierarchical data for fast lookup/search
  const allNodes = useMemo(() => {
    const out = [];
    const walk = (nodes) => {
      if (!nodes) return;
      for (const n of nodes) {
        out.push(n);
        if (n.children && n.children.length) walk(n.children);
      }
    };
    walk(roots);
    return out;
  }, [roots]);

  // Build code -> node map for quick ancestor traversal
  const byCode = useMemo(() => {
    const map = new Map();
    for (const node of allNodes) map.set(node.code, node);
    return map;
  }, [allNodes]);

  // Auto-expand ancestors of the currently selected code (if any)
  useEffect(() => {
    if (!selectedCode || allNodes.length === 0) return;
    const chain = new Set();
    let cur = byCode.get(selectedCode);
    while (cur && cur.parentCode) {
      chain.add(cur.parentCode);
      cur = byCode.get(cur.parentCode);
    }
    if (chain.size > 0) {
      setExpanded((prev) => new Set([...prev, ...chain]));
    }
  }, [selectedCode, byCode, allNodes.length]);

  // Debounce input updates to avoid spamming API
  const debouncedSet = useMemo(() => debounce((v) => setSearchTerm(v), 500), []);
  useEffect(() => () => debouncedSet.cancel(), [debouncedSet]);

  // Compute matches and visible nodes when searching
  const { ancestorSet, visibleSet } = useMemo(() => {
    const q = showSearch ? searchTerm.trim().toLowerCase() : "";
    if (!q) return { ancestorSet: null, visibleSet: null };
    const matches = new Set();
    for (const n of allNodes) {
      if (
        (n.code && String(n.code).toLowerCase().includes(q)) ||
        (n.description && n.description.toLowerCase().includes(q))
      ) {
        matches.add(n.code);
      }
    }
    const ancestors = new Set();
    for (const code of matches) {
      let cur = byCode.get(code);
      while (cur && cur.parentCode) {
        ancestors.add(cur.parentCode);
        cur = byCode.get(cur.parentCode);
      }
    }
    const visible = new Set([...matches, ...ancestors]);
    return { ancestorSet: ancestors, visibleSet: visible };
  }, [searchTerm, allNodes, byCode, showSearch]);

  // Auto-expand all ancestor chains for current search
  useEffect(() => {
    if (!ancestorSet || ancestorSet.size === 0) return;
    setExpanded((prev) => new Set([...prev, ...ancestorSet]));
  }, [ancestorSet]);

  const toggleExpand = async (node) => {
    const code = node.code;
    const next = new Set(expanded);
    if (next.has(code)) {
      next.delete(code);
      setExpanded(next);
      return;
    }
    // Expanding
    next.add(code);
    setExpanded(next);
  };

  const renderNode = (node, level = 0) => {
    const code = node.code;
    const isOpen = expanded.has(code);
    const children = node.children || [];

    // Hide non-visible nodes during search
    if (visibleSet && !visibleSet.has(code)) return null;
    return (
      <div key={code} className="pl-2">
        <div
          className={`group flex items-center justify-between py-1 cursor-pointer ${selectedCode === code ? "bg-blue-50" : ""}`}
          role="treeitem"
          aria-expanded={isOpen}
          tabIndex={0}
          onClick={() => node.level === 8 ? setHScode(node.code) : toggleExpand(node)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              node.level === 8 ? setHScode(node.code) : toggleExpand(node);
            }
          }}
        >
          <div className="flex items-center gap-1" style={{ paddingLeft: level * 12 }}>
            <button
              type="button"
              className="h-6 w-6 flex items-center justify-center text-gray-600 hover:text-gray-900"
              aria-label={isOpen ? `Collapse ${code}` : `Expand ${code}`}
            >
              {node.level !== 8 && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </button>
            <div className="text-sm">
              <span className="font-mono text-xs mr-2 text-gray-700">{code}</span>
              <span className="text-gray-800">{node.description}</span>
            </div>
                <DropdownMenu
                  open={openMenuCode === code}
                  onOpenChange={(o) => setOpenMenuCode((prev) => (o ? code : prev === code ? null : prev))}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="ml-2 h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto focus:opacity-100 focus:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
                      aria-label="Actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={6} onClick={(e) => e.stopPropagation()}>
                    {
                      node.level === 8 && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTaxDialogOpen(code); }}>
                        Xem
                      </DropdownMenuItem>
                      )
                    }
                    {
                      setHScode ? (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setHScode(code); }}>
                          Nhập
                        </DropdownMenuItem>
                      ) :
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteDialogOpen(code); }}>
                          Xóa
                        </DropdownMenuItem>
                      }
                  </DropdownMenuContent>
                </DropdownMenu>
          </div>
        </div>
        {isOpen && (
          <div className="ml-6 border-l border-gray-200 pl-2">
            {children.length === 0 ? (
              <div className="text-xs text-gray-400 py-1">Không có danh mục con</div>
            ) : (
              children.map((child) => renderNode(child, level + 1))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {showSearch && (
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo mô tả hoặc mã HS (cục bộ)"
              className="pl-8"
              onChange={(e) => debouncedSet(e.target.value)}
            />
          </div>
        </div>
      )}
      {roots.length === 0 ? (
        <div className="text-sm text-gray-500">Không có dữ liệu.</div>
      ) : (
        <div role="tree" className="rounded-md border border-gray-200 divide-y">
          {roots.map((n) => renderNode(n, n.level ?? 0))}
        </div>
      )}
      <TaxRateByHSDialog hsCode={dialogHSCode} open={dialogTaxOpen} onOpenChange={setDialogTaxOpen}/>
      <DeleteHSCodeConfirmDIalog node={dialogHSCode} open={dialogDeleteOpen} onOpenChange={setDialogDeleteOpen}/>
    </div>
  );
}
