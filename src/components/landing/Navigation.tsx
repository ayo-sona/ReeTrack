"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
} from "@heroui/react";
import { useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "#about" },
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background/80 backdrop-blur-md border-divider"
      maxWidth="xl"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-xl text-foreground">
            ReeTrack
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="start">
        <NavbarBrand>
          <Link href="/" className="font-bold text-2xl text-foreground">
            ReeTrack
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href}>
            <Link
              href={item.href}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Button
            as={Link}
            href="/auth/login"
            variant="ghost"
            className="text-foreground"
          >
            Sign In
          </Button>
          <Button
            as={Link}
            href="/auth/register"
            color="primary"
            className="bg-primary text-primary-foreground"
          >
            Get Started
          </Button>
        </NavbarItem>
        <NavbarItem className="flex sm:hidden">
          <Button
            as={Link}
            href="/auth/register"
            color="primary"
            size="sm"
            className="bg-primary text-primary-foreground"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur-md pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link
              className="w-full text-foreground/80 hover:text-foreground text-lg py-2"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/auth/login"
            variant="ghost"
            className="w-full justify-start text-foreground mt-4"
            onPress={() => setIsMenuOpen(false)}
          >
            Sign In
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
