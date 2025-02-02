import type {Metadata} from "next";
import {Inter} from 'next/font/google'
import "./globals.css";
import {Providers} from "@/app/providers";
import {SpeedInsights} from '@vercel/speed-insights/next';
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { StructuredData } from './components/StructuredData'
import { generateMetadata } from './components/Metadata'

const inter = Inter({
  subsets: ['latin'],
  display: 'auto',
  weight: "400",
})

export const metadata: Metadata = generateMetadata({});

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
        <Providers>
          <StructuredData />
          {children}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
