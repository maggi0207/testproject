// Helper function to get the current date in the format used in your function
const formatDate = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;
    return `${mm}/${dd}/${yyyy}`;
};
