let uniqueSiteNames = [];

axios.get('https://sdfdsfdfsdfsfdfsdf').then((response) => {
    response.data.features.forEach((feature) => {
        if (!uniqueSiteNames.contains(feature.properties.site_name)) {
            uniqueSiteNames.push(feature.properties.site_name);
        }
    });
};

console.log(uniqueSiteNames);