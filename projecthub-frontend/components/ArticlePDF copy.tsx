// components/ArticlePDF.tsx
'use client';

import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a365d'
  },
  metadata: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 20
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2b6cb0'
  },
  subsection: {
    marginBottom: 15,
    marginLeft: 10
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'semibold',
    marginBottom: 8,
    color: '#4a5568'
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5
  },
  list: {
    marginLeft: 15,
    marginBottom: 10
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5
  },
  codeBlock: {
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    fontFamily: 'Courier'
  },
  imageContainer: {
    marginVertical: 15,
    alignItems: 'center'
  },
  image: {
    maxWidth: '100%',
    maxHeight: 200,
    marginBottom: 5
  },
  imageCaption: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center'
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 15
  }
});

export const ArticlePDF = ({ content }) => {
    // Add null checks and default values
    if (!content) {
      return (
        <Document>
          <Page style={styles.page}>
            <Text>Error: Content not available for PDF generation</Text>
          </Page>
        </Document>
      );
    }
  
    return (
      <Document>
        <Page style={styles.page}>
          {/* Header Section with null checks */}
          <View style={styles.header}>
            {content?.image && (
              <View style={styles.imageContainer}>
                <Image 
                  style={styles.image} 
                  src={content.image || '/fallback-image.png'} 
                />
              </View>
            )}
            <Text style={styles.title}>{content?.title || 'Untitled Article'}</Text>
            <Text style={styles.metadata}>
              Written by {content?.author || 'Unknown Author'} on {content?.date || 'Unknown Date'}
            </Text>
          </View>
  
          {/* Main Content with null checks */}
          {content?.sections?.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section?.title || ''}</Text>
              {section?.content && <Text style={styles.paragraph}>{section.content}</Text>}
  
              {section?.subsections?.map((subsection, subIndex) => (
                <View key={subIndex} style={styles.subsection}>
                  {subsection?.title && <Text style={styles.subsectionTitle}>{subsection.title}</Text>}
                  {subsection?.content && <Text style={styles.paragraph}>{subsection.content}</Text>}
  
                  {subsection?.listItems?.length > 0 && (
                    <View style={styles.list}>
                      {subsection.listItems.map((item, itemIndex) => (
                        <Text key={itemIndex} style={styles.listItem}>• {item}</Text>
                      ))}
                    </View>
                  )}
  
                  {subsection?.code && (
                    <View style={styles.codeBlock}>
                      <Text>{subsection.code}</Text>
                    </View>
                  )}
  
                  {subsection?.image && (
                    <View style={styles.imageContainer}>
                      <Image 
                        style={styles.image} 
                        src={subsection.image || '/fallback-image.png'} 
                      />
                      {subsection?.imageCaption && (
                        <Text style={styles.imageCaption}>{subsection.imageCaption}</Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
  
              {index < (content?.sections?.length || 0) - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Page>
      </Document>
    );
  };