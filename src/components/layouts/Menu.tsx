// ListMenu.tsx

'use client'

import { useRoute } from '@/composable/useRoute'
import MenuSidebar from '../MenuSidebar'
import {
  FaCalendarDays,
  FaClock,
  FaComputerMouse,
  FaDatabase,
  FaDoorOpen,
  FaDownLeftAndUpRightToCenter,
  FaFile,
  FaHouse,
  FaNetworkWired,
  FaTable,
  FaTarpDroplet,
} from 'react-icons/fa6'

export default function ListMenu() {
  const route = useRoute()
  const menu = [
    {
      id: '0',
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: () => <FaHouse />,
    },
    { id: '1', name: 'Table', href: '/admin/table', icon: () => <FaTable /> },
    {
      id: '2',
      name: 'Before Leave Route',
      href: '/admin/beforeleaveroute',
      icon: () => <FaDoorOpen />,
    },
    {
      id: '3',
      name: 'Before Leave Route',
      href: '',
      icon: () => <FaDoorOpen />,
      children: [
        {
          id: '3-0',
          name: 'Before Leave Route wqewqe',
          href: '/admin/beforeleaveroute',
          icon: () => <FaDoorOpen />,
        },
      ],
    },
    {
      id: '4',
      name: 'Menu Lagi',
      href: '',
      icon: () => <FaDoorOpen />,
      children: [
        {
          id: '4-0',
          name: 'Before Leave Route wqewqe',
          href: '/admin/beforeleaveroute',
          icon: () => <FaDoorOpen />,
          children: [
            {
              id: '9-0',
              name: 'Before Leave Route wqewqe',
              href: '/admin/beforeleaveroute',
              icon: () => <FaDoorOpen />,
              children: [
                {
                  id: '9-7',
                  name: 'Before Leave Route sad',
                  href: '/admin/beforeleaveroute',
                  icon: () => <FaDoorOpen />,
                },
              ],
            },
            {
              id: '9-0',
              name: 'Before Leave Route wqewqe',
              href: '/admin/beforeleaveroute',
              icon: () => <FaDoorOpen />,
              children: [
                {
                  id: '9-7',
                  name: 'Before Leave Route sad',
                  href: '/admin/beforeleaveroute',
                  icon: () => <FaDoorOpen />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  return <MenuSidebar menu={menu} route={route} />
}
