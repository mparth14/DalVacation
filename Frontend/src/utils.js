
export const getTokens = () => {
    return {
        accessToken: sessionStorage.getItem('accessToken'),
        idToken: sessionStorage.getItem('idToken'),
        refreshToken: sessionStorage.getItem('refreshToken'),
    };
};
