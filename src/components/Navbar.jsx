import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { 
  CircleCheckIcon, 
  CircleHelpIcon, 
  CircleIcon, 
  User, 
  LogOut, 
  Globe, 
  Scale, 
  FileText, 
  Users, 
  LayoutDashboard,
  Sparkles,
  Search,
  Menu
} from "lucide-react"
import { motion } from "framer-motion"
import { useClerk } from "@clerk/clerk-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { AIAssistantToggle, useAIAssistant } from "@/components"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarItems } from "@/components/Sidebar"

const caseManagement = [
  { title: "Active Cases", href: "/cases/active", description: "View and manage ongoing legal matters and deadlines." },
  { title: "Smart Intake", href: "/cases/new", description: "Upload documents with AI-powered OCR and auto-sorting." },
  { title: "My Documents", href: "/documents", description: "Centralized repository for all case files and evidence." },
  { title: "Archived", href: "/cases/archived", description: "Access closed cases and historical records." },
]

const communityFeatures = [
  { title: "Discussion Feed", href: "/community", description: "Browse legal topics, Q&A, and trending threads." },
  { title: "Ask a Question", href: "/community/ask", description: "Post anonymously or as a verified professional." },
  { title: "Verified Answers", href: "/community/verified", description: "Expert insights from verified lawyers and stakeholders." },
]

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "bn", name: "বাংলা" },
]

export function Navbar() {
  const isMobile = useIsMobile()
  const { signOut, user } = useClerk()
  const [selectedLanguage, setSelectedLanguage] = React.useState("en")
  const { isOpen, toggleAI } = useAIAssistant()
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-primary text-primary-foreground relative z-50"
    >
      <div className="flex h-16 items-center px-4 w-full">
        <div className="flex items-center gap-4 flex-1">
          {/* Logo Section */}
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/80"
              >
                <Scale className="h-5 w-5 text-white" />
              </motion.div>
              <span className="hidden font-bold sm:inline-block text-lg tracking-tight uppercase">
                ADVYON
              </span>
            </Link>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:block">
            <NavigationMenu viewport={isMobile}>
              <NavigationMenuList className="flex-wrap">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-primary-foreground hover:bg-accent/20 hover:text-white focus:bg-accent/20 focus:text-white")}>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-accent/20 hover:text-white focus:bg-accent/20 focus:text-white data-[active]:bg-accent/20 data-[state=open]:bg-accent/20">
                    <span className="flex items-center gap-2"><FileText className="w-4 h-4"/> Cases</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-primary border border-border/30">
                      {caseManagement.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-accent/20 hover:text-white focus:bg-accent/20 focus:text-white data-[active]:bg-accent/20 data-[state=open]:bg-accent/20">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4"/> Community</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                     <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-primary border border-border/30">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-accent/20 to-accent/10 p-4 no-underline outline-none transition-all duration-200 select-none hover:shadow-md focus:shadow-md md:p-6 border border-border/30"
                            to="/community"
                          >
                            <div className="mb-2 text-lg font-medium sm:mt-4 text-white">Community Hub</div>
                            <p className="text-muted-foreground text-sm leading-tight">Collaborate, share insights, and discuss legal topics.</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {communityFeatures.map((item) => (
                        <ListItem key={item.title} href={item.href} title={item.title}>{item.description}</ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-primary-foreground hover:bg-accent/20 hover:text-white focus:bg-accent/20 focus:text-white")}>
                    <Link to="/legal-database" className="flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      Legal DB
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-primary-foreground hover:bg-accent/20 hover:text-white focus:bg-accent/20 focus:text-white")}>
                    <Link to="/ai-assistant" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-foreground" />
                      AI Tools
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right side: User Controls */}
        <div className="flex items-center gap-3 ml-auto">
          
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-white hover:bg-accent/20">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-primary border-r border-border/30 text-white w-[300px] sm:w-[400px] overflow-y-auto">
              <div className="flex flex-col gap-6 py-6">
                <Link to="/" className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/80">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight uppercase">ADVYON</span>
                </Link>

                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-2">Menu</h3>
                  <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20 text-sm">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                   <Link to="/cases" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20 text-sm">
                    <FileText className="w-4 h-4" /> Cases
                  </Link>
                   <Link to="/community" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20 text-sm">
                    <Users className="w-4 h-4" /> Community
                  </Link>
                   <Link to="/legal-database" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20 text-sm">
                    <Scale className="w-4 h-4" /> Legal DB
                  </Link>
                   <Link to="/ai-assistant" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20 text-sm">
                    <Sparkles className="w-4 h-4 text-accent-foreground" /> AI Tools
                  </Link>
                </div>

                {isDashboard && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">Dashboard</h3>
                    {sidebarItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20 text-sm",
                          location.pathname === item.href ? "bg-accent/30 text-white" : "text-muted-foreground"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* AI Assistant Toggle */}
          <AIAssistantToggle 
            onClick={toggleAI}
            isActive={isOpen}
            position="navbar"
          />

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-accent/20">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-primary border-border/30 text-white">
              <DropdownMenuLabel className="text-muted-foreground">Language</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/30" />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={cn("cursor-pointer hover:bg-accent/20 focus:bg-accent/20", selectedLanguage === lang.code && "bg-accent/30")}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile & Sign Out */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent/20">
                <Avatar className="h-8 w-8 border border-border/30">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white">
                    {user?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-primary border-border/30 text-white">
              <DropdownMenuLabel className="text-muted-foreground">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{user?.fullName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/20 focus:bg-accent/20">
                <Link to="/dashboard/profile" className="flex items-center"><User className="mr-2 h-4 w-4" /> Profile & Role</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer hover:bg-accent/20 focus:bg-accent/20 text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  )
}

function ListItem({ title, children, href, className, ...props }) {
  return (
    <li className={className} {...props}>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/20 hover:text-white focus:bg-accent/20 focus:text-white text-muted-foreground")}
        >
          <div className="text-sm font-medium leading-none text-white">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground/80">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}