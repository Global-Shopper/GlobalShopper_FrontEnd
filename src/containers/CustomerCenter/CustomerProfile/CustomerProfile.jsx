import React from "react";
import ProfileInfoCard from "./ProfileInfoCard";
import ShippingAddress from "./ShippingAddress";

const CustomerProfile = () => {
	return (
		<div className="max-w-7xl mx-auto space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<ProfileInfoCard />
				<ShippingAddress />
			</div>
		</div>
	);
};

export default CustomerProfile;
