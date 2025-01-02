import {useSelector} from 'react-redux';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const accessToken = localStorage.getItem('accessToken');

    if (!isAuthenticated && !accessToken) {
        const keycloakUrl = 'http://localhost:8080/realms/app-jee/protocol/openid-connect/auth';
        const clientId = 'web-jee';
        const redirectUri = 'http://localhost:5173/callback';
        const responseType = 'code';
        const scope = 'openid profile email';

        window.location.href = `${keycloakUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
        return null;
    }

    return children;
};
