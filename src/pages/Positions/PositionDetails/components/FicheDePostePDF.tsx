import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image, pdf, Svg } from '@react-pdf/renderer';

// Register fonts and add logo images (replace with your actual logo paths)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3674B5', // Blue color
    marginBottom: 5,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3674B5', // Blue color
    textDecoration: 'underline',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 'auto',
    marginHorizontal: 10,
  },
  divider: {
    height: 2,
    backgroundColor: '#FF6B35', // Orange color
    width: '100%',
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
    break: 'avoid',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  item: {
    marginBottom: 5,
    fontSize: 10,
  },
  listItem: {
    marginLeft: 10,
    fontSize: 10,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    paddingHorizontal: 40,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
  },
  signature: {
    marginTop: 30,
    textAlign: 'right',
  },
  signatureName: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  content: {
    flexGrow: 1,
  },
});

interface FicheDePosteProps {
  position: {
    title: string;
    grade?: {
      name: string;
      color?: string;
    };
    formation?: string;
    experience?: string;
  };
  missions: {
    data: Array<{
      id: number;
      description: string;
    }>;
  };
  competences: {
    data: Array<{
      id: number;
      description: string;
    }>;
  };
}

// Replace these with your actual logo components or images
const LeftLogo = () => (
  <Image 
    style={styles.logo} 
    src="./logo.jpg" // Replace with your actual logo path
  />
);


const FicheDePoste = ({ position, missions, competences }: FicheDePosteProps) => {
  let pageNumber = 1;
  const totalPages = React.useRef(1);

  const Header = () => (
    <View>
      <View style={styles.header}>
        <LeftLogo />
        <View style={styles.headerContent}>
          <Text style={styles.companyName}>RAIL - LOGISTIC</Text>
          <Text style={styles.companyName}>EPE-Spa Filiale SNTF (ex RAIL - TRANSIT)</Text>
          <Text style={styles.documentTitle}>Fiche de Poste</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {pageNumber === 1 && <Header />}

        <View style={styles.content}>
          {pageNumber === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Titre du poste : <Text style={styles.boldText}>{position?.title}</Text></Text>
              {position?.grade?.name && (
                <Text style={styles.sectionTitle}>Grade : <Text style={styles.boldText}>{position?.grade?.name}</Text></Text>
              )}
              {position?.formation && (
                <Text style={styles.sectionTitle}>Formation : <Text style={styles.boldText}>{position?.formation}</Text></Text>
              )}
              {position?.experience && (
                <Text style={styles.sectionTitle}>Expérience : <Text style={styles.boldText}>{position?.experience}</Text></Text>
              )}
            </View>
          )}

          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Missions principales</Text>
            {missions?.map((mission: Mission, index: number) => (
              <View key={mission.id} style={styles.listItem} wrap={false}>
                <Text wrap>{index + 1}. {mission.description}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Compétences requises</Text>
            {competences?.map((competence: Competence, index: number) => (
              <View key={competence.id} style={styles.listItem} wrap={false}>
                <Text wrap>- {competence.description}</Text>
              </View>
            ))}
          </View>

          {pageNumber === totalPages.current && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Objectif du poste</Text>
                <Text style={styles.item}>Garantir la mise en place de solutions logicielles performantes et sécurisées, tout en assurant un support utilisateur efficace et une infrastructure IT fiable.</Text>
              </View>
              <View style={styles.signature}>
                <Text style={styles.item}>Fait à Rouiba, le {new Date().toLocaleDateString('fr-FR')}</Text>
                <Text style={styles.sectionTitle}>Milia Khaled</Text>
                <Text style={styles.signatureName}>Directeur des systèmes d'information</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text>EPE Spa au Capital de 1.500.000.000 DA RC 00B0014672 NIF 000016001467246 Art 16077257021</Text>
          <Text>Adresse administrative : 01, Rue Taggort Sidi M'Hamed- ALGER.</Text>
          <Text>Direction Générale : Tél. : 213 (0)23 87 – 39 – 33 / Fax : 213 (0)23 87 – 39 – 37</Text>
          <Text>Site web : www.rail-logistic.com / e - mail : info@rail-logistic.com</Text>
        </View>
        <Text style={styles.pageNumber}>Page {pageNumber++} sur {totalPages.current}</Text>
      </Page>
    </Document>
  );
};


export default FicheDePoste;