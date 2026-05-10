import { getTranslations } from 'next-intl/server';
import ContactForm from './ContactForm';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('common.contact')
  };
}

export default async function Page() {
  return <ContactForm />;
}