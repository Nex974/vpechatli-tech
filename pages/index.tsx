import Layout from '@/components/Layout'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Vpechatli.tech – AI Мотивационни писма и CV</title>
        <meta name="description" content="Създай мотивационно писмо и адаптирай CV за конкретна обява с помощта на AI." />
        <meta property="og:title" content="Vpechatli.tech – AI Мотивационни писма и CV" />
        <meta property="og:description" content="AI инструмент за персонализиране на документи за работа." />
        <meta property="og:image" content="/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />
      </Head>
    <Layout />
    </>
  )
}
