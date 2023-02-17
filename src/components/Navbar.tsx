import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

type Props = {
  authenticated?: boolean;
  avatar?: string;
};

const Navbar = ({ authenticated, avatar }: Props) => {
  const router = useRouter();
  return (
    <nav className="navbar sticky bg-none">
      <div className="flex-1">
        <Link href={authenticated ? "/dashboard" : "/"} passHref>
          <a className="btn btn-ghost normal-case text-xl text-gray-50">
            Stuniq
          </a>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 rounded-lg">
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
          {authenticated && (
            <li>
              <a>
                Payments
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </a>
              <ul className="p-2 bg-[#0c0c0d]">
                <li>
                  <Link href="/payments/create" passHref>
                    <a>Create Payment</a>
                  </Link>
                </li>
                <li>
                  <Link href="/payments/list" passHref>
                    {" "}
                    <a>All Payments</a>
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
        {authenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={avatar} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-black backdrop-blur-sm rounded-box w-52"
            >
              <li>
                <a className="justify-between">Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a
                  onClick={async () => {
                    localStorage.removeItem("token");
                    router.replace("/login");
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn btn-ghost normal-case"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
