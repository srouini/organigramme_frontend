import React from 'react';
import { Button, Drawer, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import useData from '@/hooks/useData';
import { API_FACTURES_GROUPAGE_ENDPOINT } from '@/api/api';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: '30pt 40pt',
  },
  headerFrame: {
    height: '340px',
  },
  contentFrame: {
    marginTop: 20,
  },
  footerFrame: {
    position: 'absolute',
    bottom: 50,
    left: 40,
    right: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 9,
    marginBottom: 5,
  },
  clientInfo: {
    fontSize: 9,
    marginTop: 20,
  },
  contentTable: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    padding: '3pt',
    borderBottom: 1,
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    padding: '2pt 3pt',
    fontSize: 7,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  cellLeft: {
    flex: 1,
    textAlign: 'left',
  },
  cellRight: {
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    fontSize: 7,
    textAlign: 'center',
  },
  totalSection: {
    marginTop: 20,
    fontSize: 8,
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  totalLabel: {
    flex: 1,
    textAlign: 'left',
  },
  totalValue: {
    flex: 1,
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
  groupHeader: {
    backgroundColor: '#F8F8F8',
    padding: '3pt',
    fontSize: 7,
    fontWeight: 'bold',
  }
});

interface InvoiceProps {
  id?: number;
  data?: any;
}

interface InvoiceDocumentProps {
  data: any;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ data }) => {
  if (!data) return null;

  const { proforma, paiementsgroupage } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Frame */}
        <View style={styles.headerFrame}>
          <View>
            <Text style={styles.title}>FACTURE</Text>
            <Text style={styles.companyInfo}>EPE RAIL LOGISTIC SPA</Text>
            <Text style={styles.companyInfo}>FILIALE SNTF</Text>
            <Text style={styles.companyInfo}>Tel: 0770 27 73 79</Text>
            <Text style={styles.companyInfo}>Email: facturation@rail-logistic.dz</Text>
            <Text style={styles.companyInfo}>SiteWeb: www.rail-logistic.dz</Text>

            <View style={styles.clientInfo}>
              <Text>Client: {proforma?.sous_article?.client?.raison_sociale}</Text>
              <Text>Groupeur: {proforma?.article?.client?.raison_sociale}</Text>
              <Text>MRN: {proforma?.gros?.gros}</Text>
              <Text>Proforma: {proforma?.numero}</Text>
            </View>
          </View>
        </View>

        {/* Content Frame */}
        <View style={styles.contentFrame}>
          {/* Summary Table */}
          <View style={styles.contentTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Nombre de tcs</Text>
              <Text style={styles.cell}>Total HT</Text>
              <Text style={styles.cell}>Total TVA</Text>
              <Text style={styles.cell}>Total TTC</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>{proforma?.lignesProformagroupage?.length || '-'}</Text>
              <Text style={styles.cellRight}>{data?.HT?.toLocaleString()} DA</Text>
              <Text style={styles.cellRight}>{data?.TVA?.toLocaleString()} DA</Text>
              <Text style={styles.cellRight}>{data?.TTC?.toLocaleString()} DA</Text>
            </View>
          </View>

          {/* Details Table */}
          <View style={styles.contentTable}>
            <View style={styles.tableHeader}>
              <Text style={{ ...styles.cell, width: '42%' }}>Rubrique</Text>
              <Text style={styles.cell}>Tarif</Text>
              <Text style={styles.cell}>Qnté</Text>
              <Text style={styles.cell}>HT</Text>
              <Text style={styles.cell}>TVA</Text>
              <Text style={styles.cell}>TTC</Text>
            </View>
            {proforma?.lignesProformagroupage?.map((ligne: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cellLeft}>{ligne.rubrique}</Text>
                <Text style={styles.cellRight}>{ligne.tarif?.toLocaleString()} DA</Text>
                <Text style={styles.cell}>{ligne.quantite}</Text>
                <Text style={styles.cellRight}>{ligne.HT?.toLocaleString()} DA</Text>
                <Text style={styles.cellRight}>{ligne.TVA?.toLocaleString()} DA</Text>
                <Text style={styles.cellRight}>{ligne.TTC?.toLocaleString()} DA</Text>
              </View>
            ))}
          </View>

          {/* Totals Section */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>HT</Text>
              <Text style={styles.totalValue}>{data?.HT?.toLocaleString()} DA</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA 19%</Text>
              <Text style={styles.totalValue}>{data?.TVA?.toLocaleString()} DA</Text>
            </View>
            {data?.timber > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TIMBER</Text>
                <Text style={styles.totalValue}>{data?.timber?.toLocaleString()} DA</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TTC</Text>
              <Text style={[styles.totalValue, styles.bold]}>{data?.TTC?.toLocaleString()} DA</Text>
            </View>
          </View>

          {/* Payments Section */}
          {paiementsgroupage?.length > 0 && (
            <View style={styles.contentTable}>
              <Text style={styles.title}>Paiements</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.cell}>Date</Text>
                <Text style={styles.cell}>Mode</Text>
                <Text style={styles.cell}>Banque</Text>
                <Text style={styles.cell}>Cheque</Text>
                <Text style={styles.cell}>Montant</Text>
              </View>
              {paiementsgroupage.map((paiement: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{new Date(paiement.date).toLocaleDateString()}</Text>
                  <Text style={styles.cell}>{paiement.mode}</Text>
                  <Text style={styles.cell}>{paiement.mode === "Espèce" ? "-" : paiement.banque}</Text>
                  <Text style={styles.cell}>{paiement.mode === "Espèce" ? "-" : paiement.cheque}</Text>
                  <Text style={styles.cellRight}>{paiement.montant?.toLocaleString()} DA</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer Frame */}
        <View style={styles.footerFrame}>
          <Text style={styles.footer}>
            01 RUE TAGGORT SIDI M'HAMED WILAYA D'ALGER | COMPTE BANCAIRE CPA RIB : 00400143401000083685
          </Text>
          <Text style={styles.footer}>
            CAPITALE 1 500 000 000 DA | RC: 0014672B00 | IF: 000016001467246 | AI: 16077257021 | NIS: 099316070190623
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const Invoice: React.FC<InvoiceProps> = ({ id  }) => {
  const [visible, setVisible] = React.useState(false);
  
  const { data, isLoading } = useData({
    endpoint: `${API_FACTURES_GROUPAGE_ENDPOINT}${id}/`,
    name: "factureGroupage",
    params: {
      expand: 'proforma.lignesProformagroupage,paiementsgroupage,proforma.sous_article.client,proforma.article.client'
    }
  });

  console?.log(data)
  return (
    <>
      <Button
        type="link"
        icon={<FileTextOutlined />}
        onClick={() => setVisible(true)}
        disabled={!id}
      >
        Preview
      </Button>
      <Drawer
        title={`Facture N° ${data?.data?.numero}`}
        placement="right"
        width="80%"
        onClose={() => setVisible(false)}
        open={visible}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ height: 'calc(100vh - 55px)' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" />
            </div>
          ) : data ? (
            <PDFViewer style={{ width: '100%', height: '100%' }}>
              <InvoiceDocument data={data?.data} />
            </PDFViewer>
          ) : null}
        </div>
      </Drawer>
    </>
  );
};

export default Invoice;
