import {FaHome, FaTshirt, FaExchangeAlt, FaChartLine, FaCog ,FaTrophy, FaUsers,  FaInfoCircle, FaPhone, FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaRegQuestionCircle, FaClipboardList, FaUserFriends, FaShieldAlt } from "react-icons/fa";
import { VscActivateBreakpoints,VscGitPullRequestCreate } from "react-icons/vsc";
import { GoLaw } from "react-icons/go";
import { IoLogoGameControllerB } from "react-icons/io";
export const footerData = {
  description:
    "Football Games experience for fans of football. Compete with friends, track real-time player , and climb the leaderboard every day. Stay connected with Football like never before.",

  links: [
    {
      title: "Game Info",
      icon: FaClipboardList,
      links: [
        { title: 'How to Play', path: '/how-to-play' },
        { title: 'Game Rules', path: '/rules' },
        { title: 'About Us', path: '/about' },
      ]
    },
    {
      title: "My Account",
      icon: FaUserFriends,
      links: [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Register', path: '/register' },
      ]
    },
    {
      title: "Support",
      icon: FaRegQuestionCircle,
      links: [
        { title: 'FAQ', path: '/faq' },
        { title: 'Contact Us', path: '/contact' },
        { title: 'Help Center', path: '/help' },
      ]
    },
    {
      title: "Legal",
      icon: FaShieldAlt,
      links: [
        { title: 'Privacy Policy', path: '/privacy' },
        { title: 'Terms of Service', path: '/terms' },
        { title: 'Cookies', path: '/cookies' },
      ]
    }
  ],

  social: [
    { title: 'Facebook', path: 'https://facebook.com/laligafantasy', icon: FaFacebookF },
    { title: 'Instagram', path: 'https://instagram.com/laligafantasy', icon: FaInstagram },
    { title: 'Twitter', path: 'https://twitter.com/laligafantasy', icon: FaTwitter },
    { title: 'YouTube', path: 'https://youtube.com/laligafantasy', icon: FaYoutube },
  ]
};