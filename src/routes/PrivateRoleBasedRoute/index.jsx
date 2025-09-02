import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const PrivateRoleBasedRoute = ({ requiredRoles }) => {
    // Read current location to save the path user attempted to access
    const location = useLocation();
    // Should replace by get user role (from storage, redux store or anything...) localStorage || cookies
    const userRole = useSelector((state) => state.rootReducer?.user?.role);
    // Check user role with route's required roles
    const canAccessWithRoles = Array.isArray(requiredRoles) && requiredRoles.includes(userRole);
    // Send navigate state, included last path
    const routingState = {
        requestedPath: location.pathname + location.search,
        rejectAccess: !canAccessWithRoles
    };
    if (!userRole) {
        toast.info('Vui lòng đăng nhập để tiếp tục');
        return <Navigate to='/login' state={routingState} replace />;
    }
    return canAccessWithRoles ? <Outlet /> : <Navigate to='/' state={routingState} replace />;
};

export default PrivateRoleBasedRoute;
