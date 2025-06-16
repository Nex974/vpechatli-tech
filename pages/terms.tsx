'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function TermsPrivacy() {
  const [tab, setTab] = useState('terms')

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
      <NavBar />
    <div className="pt-30 max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
        Условия и Поверителност
      </h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger className="text-black cursor-pointer" value="terms">Общи условия</TabsTrigger>
          <TabsTrigger className="text-black cursor-pointer" value="privacy">Поверителност</TabsTrigger>
        </TabsList>

        {/* Terms and Conditions */}
        <TabsContent value="terms">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-700">Общи условия на използване на vpechatli.tech</h2>
            <p className="text-sm text-gray-500">Последна актуализация: 15 юни 2025 г.</p>

            <p><strong>1. Общи положения:</strong> Услугата предоставя автоматизирано генериране и адаптиране на автобиографии и мотивационни писма.</p>
            <p><strong>2. Регистрация и достъп:</strong> Необходима е регистрация чрез имейл или Google профил.</p>
            <p><strong>3. Платени услуги:</strong> Част от функциите са платени. Подробности са описани в сайта.</p>
            <p><strong>4. Интелектуална собственост:</strong> Всички материали са защитени с авторски права.</p>
            <p><strong>5. Ограничаване на отговорността:</strong> Не гарантираме успех при кандидатстване. Не носим отговорност за вреди.</p>
            <p><strong>6. Промени:</strong> Запазваме си правото да променяме условията по всяко време.</p>
            <p><strong>7. Контакт:</strong> vpechatli.tech@gmail.com</p>
          </div>
        </TabsContent>

        {/* Privacy Policy */}
        <TabsContent value="privacy">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-700">Политика за поверителност на vpechatli.tech</h2>
            <p className="text-sm text-gray-500">Последна актуализация: 15 юни 2025 г.</p>

            <p><strong>1. Какви данни събираме:</strong> Име, имейл, история на използване. Плащания се обработват външно.</p>
            <p><strong>2. Как ги използваме:</strong> За предоставяне на услугата, подобрения и комуникация.</p>
            <p><strong>3. Споделяне:</strong> Не продаваме и не предоставяме лични данни без съгласие.</p>
            <p><strong>4. Сигурност:</strong> Използваме криптиране и ограничен достъп.</p>
            <p><strong>5. Бисквитки:</strong> Използваме cookies за функционалност и анализ.</p>
            <p><strong>6. Вашите права:</strong> Можете да поискате достъп, корекция или изтриване на данни.</p>
            <p><strong>7. Промени:</strong> Ще ви уведомим при съществени промени в политиката.</p>
            <p><strong>8. Контакт:</strong> vpechatli.tech@gmail.com</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    <Footer />
    </>
  )
}
