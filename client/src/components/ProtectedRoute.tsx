import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { userContext } from '../context/userContext';
import { userRoleType } from '../interfaces/UserInterface';


export interface ProtectedRouteProps extends RouteProps {
  isAllowed?: boolean;
  userType?: userRoleType,
  restrictedPath?: string;
  authenticationPath?: string;
}

// tslint:disable-next-line: variable-name
export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {
    
    const context = React.useContext(userContext);
    let isAllowed = props.isAllowed;
    if (props.userType === "Admin" && context.user.role !== "Admin"){
        isAllowed = false;
    }

    let redirectPath = '';
    if (!context.isAuthenticated) {
        redirectPath = props.authenticationPath;
    }
    if (context.isAuthenticated && !isAllowed) {
        redirectPath = props.restrictedPath;
    }


    if (redirectPath) {
        // original way
        // const renderComponent = () => <Redirect to={{ pathname: redirectPath, state:{from:props.path}}} />;
        // return <Route {...props} component={renderComponent} render={(undefined)} />;

        // redirects with params in url
        const renderComponent = (props) => {
            return(<Redirect to={{ pathname: redirectPath, state:{from:props.location.pathname}}} />)
        };
        return <Route {...props} component={renderComponent} render={(undefined)} />;

    } else {
        return <Route {...props} />;
    }
};


ProtectedRoute.defaultProps = {
    isAllowed: true,
    userType: "User",
    restrictedPath: "/map",
    authenticationPath: "/login"
}

// tslint:disable-next-line: no-default-export
export default ProtectedRoute;
