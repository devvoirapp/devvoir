import type {Metadata} from "next";
import {Inter} from 'next/font/google'
import "./globals.css";
import {Providers} from "@/app/providers";
import {SpeedInsights} from '@vercel/speed-insights/next';
import React from "react";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({
  subsets: ['latin'],
  display: 'auto',
  weight: "400",
})

// const oxanium = Oxanium({
//   subsets: ['latin'],
//   display: 'auto',
//   weight: "800",
// })
//
// const playwrite = Playwrite_IN({
//   display: 'auto',
//   weight: "100"
// })
//
// const poppins = Poppins({
//   display: 'auto',
//   weight: "400"
// })
//
//
// const roboto = Roboto({
//   subsets: ['latin'],
//   display: 'auto',
//   weight: "400"
// })
//
// const montserrat = Montserrat({
//   subsets: ['latin'],
//   display: 'auto',
//   weight: "400"
// })

export const metadata: Metadata = {
  title: "Devvoir",
  description: "Track your development activity with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <Head>
      <Link rel="icon" href="favicon.ico"/>
    </Head>
    <body className={inter.className}>
        <Providers>{children}<SpeedInsights /></Providers>
      </body>
    </html>
  );
}
