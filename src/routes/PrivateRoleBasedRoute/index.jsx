import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoleBasedRoute  = (props) => {
	const { path, Component, requiredRoles } = props;
	// Should replace by get user role (from storage, redux store or anything...) localStorage || cookies
	const userRole = useSelector((state) => state.rootReducer.user.role);
	// Check user role with route's required roles
	const canAccessWithRoles = requiredRoles.includes(userRole);
	// Send navigate state, included last path
	const routingState = {
		requestedPath: path,
		rejectAccess: !canAccessWithRoles
	};

	return canAccessWithRoles ? <Component /> : <Navigate to='/login' state={routingState} />;
};


export default PrivateRoleBasedRoute;
