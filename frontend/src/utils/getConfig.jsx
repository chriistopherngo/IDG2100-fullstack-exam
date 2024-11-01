// utility function to get the config object with the token
// REMEMBER to import the token from the useAuth hook in the component where you want to use this function

function getConfig(token) {
    return {
        headers: {
            authorization: `Bearer ${token}`,
        }
    };
};


export default getConfig;