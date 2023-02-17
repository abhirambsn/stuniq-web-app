import { useRouter } from "next/router";
import React from "react";

type Props = {
  authenticated?: boolean;
  avatar?: string;
};

const Navbar = ({ authenticated, avatar }: Props) => {
  const router = useRouter();
  return (
    <nav className="navbar sticky bg-none">
      <div className="flex-1">
        <a
          className="btn btn-ghost normal-case text-xl text-gray-50"
          href={authenticated ? "/dashboard" : "/"}
        >
          Stuniq
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 rounded-lg">
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/docs">Docs</a>
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
                  <a href="/payments/create">Create Payment</a>
                </li>
                <li>
                  <a href="/payments/list">All Payments</a>
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
