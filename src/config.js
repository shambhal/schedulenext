/*export const site_details={
'url1':'http://fastapi:8080/',
'url':'http://localhost:8080/',
'curl':'http://localhost:8080/',
'myurl':'http://localhost:3000/',
'imurl':'http://localhost:8001/media/'

}*/
export const site_details = {
  url1: process.env.NEXT_PUBLIC_URL1,
  url: process.env.NEXT_PUBLIC_URL,
  curl: process.env.NEXT_PUBLIC_CURL,
  myurl: process.env.NEXT_PUBLIC_MYURL,
  imurl: process.env.NEXT_PUBLIC_IMURL,
}
export const jwtsetting=
{

 'algo':'HS256',
 'secret_key':'panimainkaunjalta'

}
export function generateUUID() {
  return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export function getUUID()
{
return sessionStorage.getItem('UUID') || generateUUID();

}