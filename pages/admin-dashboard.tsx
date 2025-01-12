"use client";

import { useState } from "react";
import Link from "next/link";
import {  CogIcon, UsersIcon, ShoppingCartIcon, HomeIcon } from "@heroicons/react/outline"; // Importing icons
import "app/globals.css";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 text-white p-6 ${isMobileMenuOpen ? "block" : "hidden"} md:block`}
      >
        <div className="text-2xl font-bold mb-6 text-center">Admin Dashboard</div>
        <ul>
          <li>
            <Link href="UploadTravelStories/upload-travel-stories" className="flex items-center py-2 px-4 hover:bg-blue-700 rounded mb-2">
              <HomeIcon className="h-6 w-6 mr-2" /> UploadTravelStories
            </Link>
          </li>
          <li>
            <Link href="/orders" className="flex items-center py-2 px-4 hover:bg-blue-700 rounded mb-2">
              <ShoppingCartIcon className="h-6 w-6 mr-2" /> Orders
            </Link>
          </li>
          <li>
            <Link href="/users" className="flex items-center py-2 px-4 hover:bg-blue-700 rounded mb-2">
              <UsersIcon className="h-6 w-6 mr-2" /> Users
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center py-2 px-4 hover:bg-blue-700 rounded mb-2">
              <CogIcon className="h-6 w-6 mr-2" /> Settings
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-600 p-4 text-white sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Tourism Site
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/profile" className="hover:text-gray-200">
                Profile
              </Link>
              <Link href="/settings" className="hover:text-gray-200">
                Settings
              </Link>
              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <UsersIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
          <p className="mt-4 text-lg text-gray-700">
            This is your main dashboard where you can manage your site.
          </p>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Visitors Card */}
            <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Total Visitors</h2>
                <HomeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mt-4">1,024</p>
              <p className="text-gray-600 text-sm mt-2">This represents the total number of visitors on your site.</p>
            </div>

            {/* Active Users Card */}
            <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Active Users</h2>
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mt-4">200</p>
              <p className="text-gray-600 text-sm mt-2">Number of users currently active on the platform.</p>
            </div>

            {/* New Orders Card */}
            <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">New Orders</h2>
                <ShoppingCartIcon className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600 mt-4">15</p>
              <p className="text-gray-600 text-sm mt-2">This is the number of new orders placed on your site.</p>
            </div>
          </div>
        </div>
      </div>

      {/*travel-stories upload */}



    </div>
  );
}
