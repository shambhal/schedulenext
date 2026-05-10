



import LoginClientPage from "../login/loginclient";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('login.title'),
  };
}
export default function  LoginPage()
{

return <LoginClientPage/>;

}




