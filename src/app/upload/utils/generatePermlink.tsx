import slugify from "./slugify";
const generatePermlink = (title: string) => {
    const slugifiedTitle = slugify(title);
    const timestamp = new Date().getTime(); 
    return `${slugifiedTitle}-${timestamp}`;
};

export default generatePermlink;