import { BranchesOutlined, FieldTimeOutlined, FileDoneOutlined, FileProtectOutlined, WindowsOutlined } from "@ant-design/icons";

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: <WindowsOutlined />,
        children: [
          { path: '/dashboard/', name: 'Dashboard'},
          { path: '/dashboard/settings', name: 'Settings' },
        ],
      },

      {
        path: '/rotation',
        name: 'Rotations',
        icon:<BranchesOutlined />,
        children: [
          { path: '/rotations/mrns', name: 'Mrns' },
          { path: '/rotations/chargement', name: 'Chargement' },
          { path: '/rotations/reception', name: 'Reception' },
        ],
      },

      {
        path: '/billing',
        name: 'Facturation',
        icon:<FileProtectOutlined />,
          children: [
          { path: '/facturation', name: 'Facturation' },
          { path: '/boncommande', name: 'Bon Commande' },
        ],
       
      },
      {
        path: '/visites',
        name: 'Visites',
        icon:<FieldTimeOutlined />,
        children: [
          { path: '/visites/ordinaire', name: 'Ordinaire' },
          { path: '/visites/groupage', name: 'Groupage' },
        ],
      },
      {
        path: '/documents',
        name: 'Documents',
        icon:<FileDoneOutlined />,
        children: [
          { path: '/documents/factures', name: 'Factures' },
          { path: '/documents/Proformas', name: 'Proformas' },
          { path: '/documents/bonsorties', name: 'Bon Sortie' },
        ],
      },
      {
        path: '/statistiques',
        name: 'Statistiques',
        icon:<FileDoneOutlined />,
        children: [
          { path: '/statistiques/prestations', name: 'Prestations' },
        ],
      },
      {
        path: '/documentsgroupage',
        name: 'Documents Groupage',
        icon:<FileDoneOutlined />,
        children: [
          { path: '/documentsgroupage/factures', name: 'Factures' },
          { path: '/documentsgroupage/Proformas', name: 'Proformas' },
          { path: '/documentsgroupage/bonsorties', name: 'Bon Sortie' },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
 
};