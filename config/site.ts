export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "SolanaHub block reward ",
  description: "SIMD96 is out but validators cannot share block rewards with stakers properly, so until simd0123 release, feel free to use this tool to calc and share block rewards with your stakers.",
  navItems: [
    // {
    //   label: "Home",
    //   href: "/",
    // }
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/block-sync-one",
    twitter: "https://x.com/SolanaHubApp",
    // docs: "https://heroui.com",
    // discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://solanahub.app/staking",
  },
};
