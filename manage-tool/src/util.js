/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-23 15:37:34
 * @LastEditTime: 2022-09-23 15:50:43
 * @FilePath: /wbmanageTool/manage-tool/src/util.js
 */
export const setCookie = (name, value) => {
    const date = new Date();
    date.setTime(date.getTime() + 2 * 24 * 3600 * 1000);
    document.cookie = `${name}=` + value + ';expires=' + date.toGMTString() + ';path=/';
};
export const getCookies = () => {
    try {
        const cookie = document.cookie || '';
        if (!cookie) {
            return {};
        }
        return cookie.split(';').reduce((total, current) => {
            const cookieItem = current.split('=');
            return {
                ...total,
                [cookieItem[0].trim()]: cookieItem[1].trim()
            };
        }, {});
    }
    catch (e) {
        return {};
    }
};

export const getCookie = name => {
    return getCookies()[name];
};