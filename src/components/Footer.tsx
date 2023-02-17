import Link from "next/link";
import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="pt-6 max-w-[100rem] mx-auto px-3 space-y-10 border-t border-gray-400">
      <section className="flex items-center justify-between text-sm">
        <h2 className="text-gray-50 font-bold text-2xl">Stuniq</h2>
        <ul>
          <li>
            <Link href="/about" passHref>
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link href="/docs" passHref>
              <a>Docs</a>
            </Link>
          </li>
          <li>
            <Link href="/policies">
              <a>Policies</a>
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link href="/contact" passHref>
              <a>Contact Us</a>
            </Link>
          </li>
          <li>
            <Link href="/sitemap.xml" passHref>
              <a>Sitemap</a>
            </Link>
          </li>
        </ul>
      </section>
      <section className="border-t border-gray-600 text-lg text-gray-300 text-center">
        <p>Copyright &copy;2022 Stuniq</p>
      </section>
    </footer>
  );
};

export default Footer;
