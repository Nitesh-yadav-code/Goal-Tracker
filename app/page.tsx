"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"
import Head from "next/head"
import Image from "next/image";

// Types
type User = {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

type Milestone = {
  id: string
  title: string
  completed: boolean
  dueDate: string
}

type Comment = {
  id: string
  userId: string
  text: string
  timestamp: string
}

type Goal = {
  id: string
  title: string
  description: string
  category: string
  progress: number
  dueDate: string
  createdAt: string
  userId: string
  teamMembers: string[]
  milestones: Milestone[]
  comments: Comment[]
  color: string
}

type Page = "landing" | "dashboard" | "goalDetail" | "profile" | "settings" | "team"

// Mock Data
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Product Manager",
  },
  {
    id: "u2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "UX Designer",
  },
  {
    id: "u3",
    name: "Michael Chen",
    email: "michael@example.com",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "Developer",
  },
  {
    id: "u4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    role: "Marketing Specialist",
  },
  {
    id: "u5",
    name: "You",
    email: "you@example.com",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    role: "Team Lead",
  },
]

const generateMockGoals = (): Goal[] => {
  return [
    {
      id: "g1",
      title: "Complete Website Redesign",
      description: "Redesign the company website with new branding and improved user experience.",
      category: "Work",
      progress: 75,
      dueDate: "2025-06-15",
      createdAt: "2025-03-01",
      userId: "u5",
      teamMembers: ["u1", "u2", "u3"],
      color: COLORS[0],
      milestones: [
        {
          id: "m1",
          title: "Research & Competitive Analysis",
          completed: true,
          dueDate: "2025-03-15",
        },
        {
          id: "m2",
          title: "Wireframes & Prototypes",
          completed: true,
          dueDate: "2025-04-01",
        },
        {
          id: "m3",
          title: "Design System Creation",
          completed: true,
          dueDate: "2025-04-15",
        },
        {
          id: "m4",
          title: "Frontend Development",
          completed: false,
          dueDate: "2025-05-15",
        },
        {
          id: "m5",
          title: "Testing & Launch",
          completed: false,
          dueDate: "2025-06-10",
        },
      ],
      comments: [
        {
          id: "c1",
          userId: "u1",
          text: "The wireframes look great! I especially like the new navigation structure.",
          timestamp: "2025-04-02T14:30:00Z",
        },
        {
          id: "c2",
          userId: "u2",
          text: "I've completed the design system. Let me know if you need any adjustments before we move to development.",
          timestamp: "2025-04-16T09:15:00Z",
        },
        {
          id: "c3",
          userId: "u5",
          text: "Great work everyone! We're on track to meet our deadline.",
          timestamp: "2025-04-17T11:45:00Z",
        },
      ],
    },
    {
      id: "g2",
      title: "Q2 Marketing Campaign",
      description: "Plan and execute the Q2 marketing campaign focusing on new product features.",
      category: "Marketing",
      progress: 40,
      dueDate: "2025-06-30",
      createdAt: "2025-03-15",
      userId: "u5",
      teamMembers: ["u1", "u4"],
      color: COLORS[1],
      milestones: [
        {
          id: "m1",
          title: "Campaign Strategy",
          completed: true,
          dueDate: "2025-03-30",
        },
        {
          id: "m2",
          title: "Content Creation",
          completed: true,
          dueDate: "2025-04-15",
        },
        {
          id: "m3",
          title: "Social Media Schedule",
          completed: false,
          dueDate: "2025-05-01",
        },
        {
          id: "m4",
          title: "Email Marketing",
          completed: false,
          dueDate: "2025-05-15",
        },
        {
          id: "m5",
          title: "Analytics & Reporting",
          completed: false,
          dueDate: "2025-06-25",
        },
      ],
      comments: [
        {
          id: "c1",
          userId: "u4",
          text: "I've drafted the content calendar. Can we review it in our next meeting?",
          timestamp: "2025-04-10T13:20:00Z",
        },
      ],
    },
    {
      id: "g3",
      title: "Mobile App Development",
      description: "Develop a mobile app version of our platform for iOS and Android.",
      category: "Development",
      progress: 30,
      dueDate: "2025-08-30",
      createdAt: "2025-02-15",
      userId: "u5",
      teamMembers: ["u3"],
      color: COLORS[2],
      milestones: [
        {
          id: "m1",
          title: "Requirements Gathering",
          completed: true,
          dueDate: "2025-03-01",
        },
        {
          id: "m2",
          title: "UI/UX Design",
          completed: true,
          dueDate: "2025-04-01",
        },
        {
          id: "m3",
          title: "Frontend Development",
          completed: false,
          dueDate: "2025-06-01",
        },
        {
          id: "m4",
          title: "Backend Integration",
          completed: false,
          dueDate: "2025-07-15",
        },
        {
          id: "m5",
          title: "Testing & App Store Submission",
          completed: false,
          dueDate: "2025-08-15",
        },
      ],
      comments: [
        {
          id: "c1",
          userId: "u3",
          text: "I've started working on the frontend components. The design looks great!",
          timestamp: "2025-04-05T10:30:00Z",
        },
        {
          id: "c2",
          userId: "u2",
          text: "Let me know if you need any clarification on the design specs.",
          timestamp: "2025-04-06T14:45:00Z",
        },
      ],
    },
    {
      id: "g4",
      title: "Team Building Retreat",
      description: "Organize a team building retreat to improve collaboration and morale.",
      category: "Team",
      progress: 60,
      dueDate: "2025-05-20",
      createdAt: "2025-03-10",
      userId: "u5",
      teamMembers: ["u1", "u2", "u3", "u4"],
      color: COLORS[3],
      milestones: [
        {
          id: "m1",
          title: "Location Selection",
          completed: true,
          dueDate: "2025-03-20",
        },
        {
          id: "m2",
          title: "Activity Planning",
          completed: true,
          dueDate: "2025-04-01",
        },
        {
          id: "m3",
          title: "Logistics & Accommodation",
          completed: true,
          dueDate: "2025-04-15",
        },
        {
          id: "m4",
          title: "Team Communication",
          completed: false,
          dueDate: "2025-05-01",
        },
        {
          id: "m5",
          title: "Post-Retreat Survey",
          completed: false,
          dueDate: "2025-05-25",
        },
      ],
      comments: [
        {
          id: "c1",
          userId: "u1",
          text: "I've booked the mountain lodge for May 15-17. It looks amazing!",
          timestamp: "2025-03-22T09:10:00Z",
        },
        {
          id: "c2",
          userId: "u4",
          text: "Can we include some outdoor team-building activities?",
          timestamp: "2025-03-25T11:30:00Z",
        },
        {
          id: "c3",
          userId: "u5",
          text: "Great idea! I'll add hiking and a team challenge to the agenda.",
          timestamp: "2025-03-25T13:45:00Z",
        },
      ],
    },
    {
      id: "g5",
      title: "Product Launch: Version 2.0",
      description: "Prepare and execute the launch of our product version 2.0 with new features.",
      category: "Product",
      progress: 20,
      dueDate: "2025-07-15",
      createdAt: "2025-04-01",
      userId: "u5",
      teamMembers: ["u1", "u3", "u4"],
      color: COLORS[4],
      milestones: [
        {
          id: "m1",
          title: "Feature Finalization",
          completed: true,
          dueDate: "2025-04-15",
        },
        {
          id: "m2",
          title: "Marketing Materials",
          completed: false,
          dueDate: "2025-05-15",
        },
        {
          id: "m3",
          title: "Beta Testing",
          completed: false,
          dueDate: "2025-06-01",
        },
        {
          id: "m4",
          title: "Documentation Update",
          completed: false,
          dueDate: "2025-06-15",
        },
        {
          id: "m5",
          title: "Launch Event",
          completed: false,
          dueDate: "2025-07-10",
        },
      ],
      comments: [
        {
          id: "c1",
          userId: "u1",
          text: "The feature list looks good. I think users will be excited about the new dashboard.",
          timestamp: "2025-04-16T10:20:00Z",
        },
      ],
    },
  ]
}

// Main Component
export default function GoalTracker() {
  // State
  const [currentPage, setCurrentPage] = useState<Page>("landing")
  const [currentUser] = useState<User>(mockUsers[4]) // "You" user
  const [goals, setGoals] = useState<Goal[]>(generateMockGoals())
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [newGoalModal, setNewGoalModal] = useState(false)
  const [newGoalData, setNewGoalData] = useState({
    title: "",
    description: "",
    category: "Work",
    dueDate: "",
  })
  const [newMilestoneModal, setNewMilestoneModal] = useState(false)
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    dueDate: "",
  })
  const [newComment, setNewComment] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [teamMemberModal, setTeamMemberModal] = useState(false)
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(false)

  // Refs
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Handlers
  const handlePageChange = (page: Page, goal: Goal | null = null) => {
    setCurrentPage(page)
    if (goal) {
      setSelectedGoal(goal)
    }
    setMobileMenuOpen(false)
  }

  const handleCreateGoal = () => {
    if (!newGoalData.title || !newGoalData.description || !newGoalData.dueDate) {
      alert("Please fill in all required fields")
      return
    }
    const newGoal: Goal = {
      id: `g${goals.length + 1}`,
      title: newGoalData.title,
      description: newGoalData.description,
      category: newGoalData.category,
      progress: 0,
      dueDate: newGoalData.dueDate,
      createdAt: new Date().toISOString().split("T")[0],
      userId: currentUser.id,
      teamMembers: selectedTeamMembers,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      milestones: [],
      comments: [],
    }

    setGoals([...goals, newGoal])
    setNewGoalData({
      title: "",
      description: "",
      category: "Work",
      dueDate: "",
    })
    setSelectedTeamMembers([])
    setNewGoalModal(false)
  }

  const handleAddMilestone = () => {
    if (!selectedGoal || !newMilestone.title || !newMilestone.dueDate) {
      alert("Please fill in all required fields")
      return
    }

    const milestone: Milestone = {
      id: `m${selectedGoal.milestones.length + 1}`,
      title: newMilestone.title,
      completed: false,
      dueDate: newMilestone.dueDate,
    }

    const updatedGoal = {
      ...selectedGoal,
      milestones: [...selectedGoal.milestones, milestone],
    }

    setGoals(goals.map((goal) => (goal.id === selectedGoal.id ? updatedGoal : goal)))
    setSelectedGoal(updatedGoal)
    setNewMilestone({
      title: "",
      dueDate: "",
    })
    setNewMilestoneModal(false)
  }

  const handleToggleMilestone = (milestoneId: string) => {
    if (!selectedGoal) return

    const updatedMilestones = selectedGoal.milestones.map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone,
    )

    // Calculate new progress
    const completedCount = updatedMilestones.filter((m) => m.completed).length
    const newProgress = Math.round((completedCount / updatedMilestones.length) * 100)

    const updatedGoal = {
      ...selectedGoal,
      milestones: updatedMilestones,
      progress: newProgress,
    }

    setGoals(goals.map((goal) => (goal.id === selectedGoal.id ? updatedGoal : goal)))
    setSelectedGoal(updatedGoal)
  }

  const handleAddComment = () => {
    if (!selectedGoal || !newComment.trim()) return

    const comment: Comment = {
      id: `c${selectedGoal.comments.length + 1}`,
      userId: currentUser.id,
      text: newComment,
      timestamp: new Date().toISOString(),
    }

    const updatedGoal = {
      ...selectedGoal,
      comments: [...selectedGoal.comments, comment],
    }

    setGoals(goals.map((goal) => (goal.id === selectedGoal.id ? updatedGoal : goal)))
    setSelectedGoal(updatedGoal)
    setNewComment("")
  }

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      setGoals(goals.filter((goal) => goal.id !== goalId))
      if (selectedGoal && selectedGoal.id === goalId) {
        setSelectedGoal(null)
        setCurrentPage("dashboard")
      }
    }
  }

  // Filtered goals
  const filteredGoals = goals.filter((goal) => {
    const matchesCategory = filterCategory === "All" || goal.category === filterCategory
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Chart data
  const categoryData = goals.reduce((acc: { name: string; value: number }[], goal) => {
    const existingCategory = acc.find((item) => item.name === goal.category)
    if (existingCategory) {
      existingCategory.value += 1
    } else {
      acc.push({ name: goal.category, value: 1 })
    }
    return acc
  }, [])

  

  const timelineData = goals.map((goal) => ({
    name: goal.title.substring(0, 15) + (goal.title.length > 15 ? "..." : ""),
    progress: goal.progress,
  }))

  // Get user by ID
  const getUserById = (userId: string): User => {
    return mockUsers.find((user) => user.id === userId) || mockUsers[0]
  }

  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  // Calculate days remaining
  const getDaysRemaining = (dueDate: string): number => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Render functions
  //  LandingPage Started -------------------------------->
  const renderLandingPage = () => (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Track Your Goals, <span className="text-blue-600 dark:text-blue-400">Achieve More</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Set meaningful goals, track your progress, and celebrate your achievements with our intuitive goal
                tracking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Get Started
                </button>
                
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <Image
                src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                alt="Goal Tracking"
                width={300}
  height={300}   
                className="rounded-lg shadow-xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to set, track, and achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Goal Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set clear goals with progress bars to visualize your journey and stay motivated.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Milestone Markers</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Break down goals into achievable milestones and celebrate your progress along the way.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Feedback System</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get comments and feedback from teammates or accountability partners to stay on track.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trusted by professionals and teams around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Image
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="User"
                  width={12}
                  height={12}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Jessica Chen</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
              &quot;This platform has completely transformed how I approach my goals. The visual progress bars and
                milestone markers keep me motivated every day.&quot;
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
              <Image
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="User"
                  width={12}
                  height={12}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Marcus Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team Director</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
              &quot;As a team leader, I have seen productivity increase by 30% since we started using this goal tracker. The
                feedback system has improved our collaboration tremendously.&quot;
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
              <Image
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="User"
                  width={12}
                  height={12}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Sophia Rodriguez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Freelance Designer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
              &quot;I juggle multiple projects at once, and this tool helps me stay organized and focused. The milestone
                tracking is a game-changer for my workflow.&quot;
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Achieve Your Goals?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful goal-setters today and transform how you track your progress.
          </p>
          <button
            onClick={() => setCurrentPage("dashboard")}
            className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors duration-200 text-lg"
          >
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  )
//  LandingPage finished -------------------------------->


  // Dashboard Page Started -------------------------------->
  const renderDashboard = () => (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your goals</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <button
              onClick={() => setNewGoalModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Goal
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter((goal) => goal.progress === 100).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter((goal) => goal.progress > 0 && goal.progress < 100).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter((goal) => new Date(goal.dueDate) < new Date() && goal.progress < 100).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Goals by Category</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Goal Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" name="Progress %" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory("All")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              filterCategory === "All"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {Array.from(new Set(goals.map((goal) => goal.category))).map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filterCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => (
              <motion.div
                key={goal.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="h-2" style={{ backgroundColor: goal.color }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                      {goal.category}
                    </span>
                    <div className="flex">
                      <button
                        onClick={() => handlePageChange("goalDetail", goal)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="ml-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{goal.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{goal.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${goal.progress}%`,
                          backgroundColor: goal.color,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg
                        className="w-4 h-4 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formatDate(goal.dueDate)}
                    </div>
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {goal.teamMembers.slice(0, 3).map((memberId) => {
                          const user = getUserById(memberId)
                          return (
                            <Image
                              key={memberId}
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                            />
                          )
                        })}
                        {goal.teamMembers.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-300 border-2 border-white dark:border-gray-800">
                            +{goal.teamMembers.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg
                          className="w-4 h-4 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {goal.comments.length}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No goals found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? `No goals matching "${searchTerm}"`
                  : filterCategory !== "All"
                    ? `No goals in the "${filterCategory}" category`
                    : "Start by creating your first goal"}
              </p>
              <button
                onClick={() => {
                  setNewGoalModal(true)
                  setSearchTerm("")
                  setFilterCategory("All")
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Create a Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderGoalDetail = () => {
    if (!selectedGoal) return null

    const completedMilestones = selectedGoal.milestones.filter((m) => m.completed).length
    const totalMilestones = selectedGoal.milestones.length
    const daysRemaining = getDaysRemaining(selectedGoal.dueDate)

    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <button
              onClick={() => handlePageChange("dashboard")}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Dashboard
            </button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mr-3">
                    {selectedGoal.title}
                  </h1>
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${selectedGoal.color}20`,
                      color: selectedGoal.color,
                    }}
                  >
                    {selectedGoal.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Created on {formatDate(selectedGoal.createdAt)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteGoal(selectedGoal.id)}
                  className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Delete Goal
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Progress Overview</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {completedMilestones} of {totalMilestones} milestones completed
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGoal.progress}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {daysRemaining > 0
                          ? `${daysRemaining} days remaining`
                          : daysRemaining === 0
                            ? "Due today"
                            : `${Math.abs(daysRemaining)} days overdue`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="h-4 rounded-full"
                    style={{
                      width: `${selectedGoal.progress}%`,
                      backgroundColor: selectedGoal.color,
                    }}
                  ></div>
                </div>
              </motion.div>

              {/* Description Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedGoal.description}</p>
              </motion.div>

              {/* Milestones Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Milestones</h2>
                  <button
                    onClick={() => setNewMilestoneModal(true)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {selectedGoal.milestones.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedGoal.milestones.map((milestone) => (
                      <li key={milestone.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={() => handleToggleMilestone(milestone.id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-800"
                        />
                        <div className="ml-3 flex-1">
                          <p
                            className={`font-medium ${
                              milestone.completed
                                ? "text-gray-500 dark:text-gray-400 line-through"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {milestone.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Due: {formatDate(milestone.dueDate)}
                          </p>
                        </div>
                        {milestone.completed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Completed
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No milestones yet</p>
                    <button
                      onClick={() => setNewMilestoneModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Add First Milestone
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Comments Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Comments & Feedback</h2>
                <div className="space-y-6 mb-6">
                  {selectedGoal.comments.length > 0 ? (
                    selectedGoal.comments.map((comment) => {
                      const user = getUserById(comment.userId)
                      return (
                        <div key={comment.id} className="flex gap-4">
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            height={40}
                            width={40}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                              <span className="mx-2 text-gray-500 dark:text-gray-400">•</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatTimestamp(comment.timestamp)}
                              </p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No comments yet. Be the first to leave feedback!
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Add a comment</h3>
                  <div className="flex gap-4">
                    <Image
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      height={40}
                      width={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      ></textarea>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team Members Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h2>
                  <button
                    onClick={() => setTeamMemberModal(true)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Goal Owner */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={getUserById(selectedGoal.userId).avatar || "/placeholder.svg"}
                      alt={getUserById(selectedGoal.userId).name}
                      height={40}
                      width={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getUserById(selectedGoal.userId).name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                    </div>
                  </div>

                  {/* Team Members */}
                  {selectedGoal.teamMembers.length > 0 ? (
                    selectedGoal.teamMembers.map((memberId) => {
                      const member = getUserById(memberId)
                      return (
                        <div key={memberId} className="flex items-center gap-3">
                          <Image
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            height={40}
                            width={40}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-2">No team members yet</p>
                  )}
                </div>
              </motion.div>

              {/* Due Date Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Due Date</h2>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedGoal.dueDate)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {daysRemaining > 0
                        ? `${daysRemaining} days remaining`
                        : daysRemaining === 0
                          ? "Due today"
                          : `${Math.abs(daysRemaining)} days overdue`}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Activity Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {selectedGoal.comments.length > 0 ? (
                    selectedGoal.comments
                      .slice(-3)
                      .reverse()
                      .map((comment) => {
                        const user = getUserById(comment.userId)
                        return (
                          <div key={comment.id} className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                              <svg
                                className="w-4 h-4 text-purple-600 dark:text-purple-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">
                                <span className="font-medium">{user.name}</span> commented
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimestamp(comment.timestamp)}
                              </p>
                            </div>
                          </div>
                        )
                      })
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-2">No recent activity</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderProfile = () => (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={currentUser.avatar || "/placeholder.svg"}
                  alt={currentUser.name}
                  height={96}
                  width={96}
                  className="w-24 h-24 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{currentUser.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{currentUser.role}</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                    Change Photo
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    defaultValue={currentUser.name.split(" ")[0]}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    defaultValue={currentUser.name.split(" ")[1] || ""}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={currentUser.email}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <input
                  type="text"
                  defaultValue={currentUser.role}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea
                  rows={4}
                  defaultValue="I'm a goal-oriented professional passionate about productivity and team collaboration."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark themes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your goals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
            <div className="space-y-6">
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-3">Theme</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    onClick={() => setDarkMode(false)}
                    className={`cursor-pointer rounded-lg border p-4 ${
                      !darkMode
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200"></div>
                      <svg
                        className={`w-5 h-5 ${!darkMode ? "text-blue-600" : "text-transparent"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">Light</p>
                  </div>
                  <div
                    onClick={() => setDarkMode(true)}
                    className={`cursor-pointer rounded-lg border p-4 ${
                      darkMode
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700"></div>
                      <svg
                        className={`w-5 h-5 ${darkMode ? "text-blue-600" : "text-transparent"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                  </div>
                 
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your goals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Goal Reminders</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get reminders about upcoming goal deadlines
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Team Updates</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications when team members make changes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Make Profile Public</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow others to see your profile and goals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={false} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Show Goal Progress</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow team members to see your goal progress
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account</h2>
            <div className="space-y-4">
             
              <button className="w-full px-4 py-2 text-left border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-colors duration-200">
                Delete Account
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={()=>setCurrentPage("dashboard")} className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200">
              Cancel
            </button>
            <button onClick={()=>setCurrentPage("dashboard")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTeam = () => {

    const handleInviteClick = () => {
      // const email = "niteshkumaryadav8687@gmail.com"; 
      // const subject = encodeURIComponent("You are Invited!");
      // const body = encodeURIComponent(
      //   "Hi,I would like to invite you to join our platform.Click here to get started: https://yourwebsite.com/invite"
      // );
  
      // window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
      <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your team and collaborators</p>
          </div>
          <button onClick={handleInviteClick} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Invite Member
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search team members..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Goals
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          height={40}
                          width={40}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900 dark:text-white">{user.role}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900 dark:text-white">
                        {goals.filter((goal) => goal.teamMembers.includes(user.id) || goal.userId === user.id).length}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    )
  }

  // Render the current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "landing":
        return renderLandingPage()
      case "dashboard":
        return renderDashboard()
      case "goalDetail":
        return renderGoalDetail()
      case "profile":
        return renderProfile()
      case "settings":
        return renderSettings()
      case "team":
        return renderTeam()
      default:
        return renderDashboard()
    }
  }

  // Render modals
  const renderModals = () => (
    <>
      {/* New Goal Modal */}
      <AnimatePresence>
        {newGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setNewGoalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Goal</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newGoalData.title}
                    onChange={(e) => setNewGoalData({ ...newGoalData, title: e.target.value })}
                    placeholder="Enter goal title"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newGoalData.description}
                    onChange={(e) => setNewGoalData({ ...newGoalData, description: e.target.value })}
                    placeholder="Enter goal description"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={newGoalData.category}
                    onChange={(e) => setNewGoalData({ ...newGoalData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Learning">Learning</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Team">Team</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newGoalData.dueDate}
                    onChange={(e) => setNewGoalData({ ...newGoalData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Team Members
                  </label>
                  <div className="space-y-2">
                    {mockUsers
                      .filter((user) => user.id !== currentUser.id)
                      .map((user) => (
                        <div key={user.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={selectedTeamMembers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTeamMembers([...selectedTeamMembers, user.id])
                              } else {
                                setSelectedTeamMembers(selectedTeamMembers.filter((id) => id !== user.id))
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-800"
                          />
                          <label htmlFor={`user-${user.id}`} className="ml-2 flex items-center">
                            <Image
                              width={24}
                              height={24}
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-gray-900 dark:text-white">{user.name}</span>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setNewGoalModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Milestone Modal */}
      <AnimatePresence>
        {newMilestoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setNewMilestoneModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Milestone</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="Enter milestone title"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setNewMilestoneModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMilestone}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Add Milestone
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Member Modal */}
      <AnimatePresence>
        {teamMemberModal && selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setTeamMemberModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Team Members</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  {mockUsers
                    .filter((user) => user.id !== currentUser.id)
                    .map((user) => (
                      <div key={user.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`team-user-${user.id}`}
                          checked={selectedGoal.teamMembers.includes(user.id)}
                          onChange={(e) => {
                            const updatedGoal = { ...selectedGoal }
                            if (e.target.checked) {
                              updatedGoal.teamMembers = [...updatedGoal.teamMembers, user.id]
                            } else {
                              updatedGoal.teamMembers = updatedGoal.teamMembers.filter((id) => id !== user.id)
                            }
                            setGoals(goals.map((goal) => (goal.id === selectedGoal.id ? updatedGoal : goal)))
                            setSelectedGoal(updatedGoal)
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-800"
                        />
                        <label htmlFor={`team-user-${user.id}`} className="ml-2 flex items-center">
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setTeamMemberModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <>
      <Head>
        <title>Goal Tracker - Track Your Goals, Achieve More</title>
        <meta
          name="description"
          content="Set meaningful goals, track your progress, and celebrate your achievements with our intuitive goal tracking platform."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Navbar */}
        <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mr-2 rounded-md p-2 text-gray-500 dark:text-gray-400 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button onClick={() => setCurrentPage("landing")} className="flex items-center gap-2">
                  <svg
                    className="h-8 w-8 text-blue-600 dark:text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M18.5 3.5L3.5 18.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="15.5" cy="15.5" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="text-xl font-bold hidden md:block">GoalTracker</span>
                </button>
              </div>

              {currentPage !== "landing" && (
                <nav className="hidden lg:flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange("dashboard")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === "dashboard"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handlePageChange("team")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === "team"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Team
                  </button>
                </nav>
              )}

              {currentPage !== "landing" && (
                <div className="flex items-center gap-2">
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    >
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start">
                              <Image
                                src={mockUsers[0].avatar || "/placeholder.svg"}
                                alt={mockUsers[0].name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  <span className="font-medium">{mockUsers[0].name}</span> commented on your goal
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start">
                              <Image
                                src={mockUsers[1].avatar || "/placeholder.svg"}
                                alt={mockUsers[1].name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  <span className="font-medium">{mockUsers[1].name}</span> completed a milestone
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start">
                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                <svg
                                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  Reminder: &quot;Website Redesign&quot; goal is due tomorrow
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2"
                    >
                      <Image
                        src={currentUser.avatar || "/placeholder.svg"}
                        alt={currentUser.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {currentUser.name}
                      </span>
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handlePageChange("profile")
                              setProfileDropdownOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Your Profile
                          </button>
                          <button
                            onClick={() => {
                              handlePageChange("settings")
                              setProfileDropdownOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Settings
                          </button>
                          <button
                            onClick={() => {
                              setCurrentPage("landing")
                              setProfileDropdownOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && currentPage !== "landing" && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-0 z-30 lg:hidden"
            >
              <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
              <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-8 w-8 text-blue-600 dark:text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M18.5 3.5L3.5 18.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="15.5" cy="15.5" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    <span className="text-xl font-bold">GoalTracker</span>
                  </div>
                </div>
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handlePageChange("dashboard")}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === "dashboard"
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handlePageChange("team")}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === "team"
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Team
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handlePageChange("profile")}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === "profile"
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handlePageChange("settings")}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === "settings"
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Settings
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setCurrentPage("landing")}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Sign out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="min-h-screen">{renderCurrentPage()}</main>

        {/* Footer */}
        {currentPage === "landing" && (
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="h-8 w-8 text-blue-600 dark:text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M18.5 3.5L3.5 18.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="15.5" cy="15.5" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">GoalTracker</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Set meaningful goals, track your progress, and achieve more with our intuitive goal tracking
                    platform.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993-2.279 4.075 4.075 0 00-.533 0 4.109 4.109 0 00-2.1 4.107 4.107 0 00.962 2.494c-.085-.002-.17-.012-.255-.012a4.14 4.14 0 00-4.107 4.107c0 2.037 1.021 3.805 2.565 4.974A8.358 8.358 0 004 16.17a8.287 8.287 0 011.381.083 4.109 4.109 0 003.805 2.245l.003.001z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.477 2 12c0 3.55 2.299 6.547 5.47 7.59V16.18c-1.612 0-3.475-.496-3.475-2.228 0-.496.253-.943.676-1.228C4.175 12.433 4 11.433 4 10.34c0-2.21 1.492-4.075 3.475-4.772V3.79c-3.033 1.043-5.47 4.04-5.47 7.59 0 4.418 3.582 8 8 8 0-1.335-.435-3.852-1.14-5.552 1.007-.082 1.976.326 2.592 1.048.616.722 1.003 1.661 1.003 2.555 0 2.732-1.863 3.228-3.475 3.228v1.408c3.033-1.043 5.47-4.04 5.47-7.59 0-4.418-3.582-8-8-8zm0 12.545c-1.507 0-2.732-1.225-2.732-2.732 0-1.506 1.225-2.73 2.732-2.73 1.506 0 2.73 1.224 2.73 2.73 0 1.507-1.224 2.732-2.73 2.732z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Product</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Overview
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Solutions
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Pricing
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Careers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Contact
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Terms
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Privacy
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Support</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Community
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
                &copy; 2025 GoalTracker. All rights reserved.
              </div>
            </div>
          </footer>
        )}

        {renderModals()}
      </div>
    </>
  )
}
