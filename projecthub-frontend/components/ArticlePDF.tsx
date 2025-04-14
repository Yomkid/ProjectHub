// components/ArticlePDF.tsx
'use client';

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a365d'
  },
  metadata: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 15
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2b6cb0'
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5
  },
  objectivesContainer: {
    backgroundColor: '#f0fff4',
    padding: 10,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#38a169'
  },
  objectivesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2f855a'
  },
  list: {
    marginLeft: 15
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5
  },
  codeBlock: {
    backgroundColor: '#f7fafc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    fontFamily: 'Courier',
    fontSize: 10
  },
  imageContainer: {
    marginVertical: 15,
    alignItems: 'center'
  },
  image: {
    maxWidth: '80%',
    maxHeight: 200,
    marginBottom: 5
  },
  imageCaption: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center'
  },
  watermark: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#ccc',
    opacity: 0.5
  }
});

export const ArticlePDF = ({ content }) => {
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
    <Document
      title={content.title}
      author={content.author}
      subject="Technical Article"
      keywords={['face recognition', 'react', 'flask']}
    >
      <Page style={styles.page}>
        <View style={styles.header}>
          {content.image && (
            <View style={styles.imageContainer}>
              <Image style={styles.image} src={content.image} />
            </View>
          )}
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.metadata}>
            Written by {content.author} on {content.date}
          </Text>
        </View>

        {content.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content && <Text style={styles.paragraph}>{section.content}</Text>}

            {section.subsections.map((subsection, subIndex) => {
              if (subsection.type === 'objectives') {
                return (
                  <View key={subIndex} style={styles.objectivesContainer}>
                    {subsection.title && (
                      <Text style={styles.objectivesTitle}>{subsection.title}</Text>
                    )}
                    <View style={styles.list}>
                      {subsection.listItems?.map((item, itemIndex) => (
                        <Text key={itemIndex} style={styles.listItem}>• {item}</Text>
                      ))}
                    </View>
                  </View>
                );
              }

              if (subsection.type === 'code') {
                return (
                  <View key={subIndex} style={styles.codeBlock}>
                    <Text>{subsection.code}</Text>
                  </View>
                );
              }

              if (subsection.type === 'image') {
                return (
                  <View key={subIndex} style={styles.imageContainer}>
                    <Image style={styles.image} src={subsection.image} />
                    {subsection.imageCaption && (
                      <Text style={styles.imageCaption}>{subsection.imageCaption}</Text>
                    )}
                  </View>
                );
              }

              return (
                <View key={subIndex} style={{ marginBottom: 15 }}>
                  {subsection.title && (
                    <Text style={styles.sectionTitle}>{subsection.title}</Text>
                  )}
                  {subsection.content && (
                    <Text style={styles.paragraph}>{subsection.content}</Text>
                  )}
                  {subsection.listItems?.length > 0 && (
                    <View style={styles.list}>
                      {subsection.listItems.map((item, itemIndex) => (
                        <Text key={itemIndex} style={styles.listItem}>• {item}</Text>
                      ))}
                    </View>
                  )}
                  {subsection.code && (
                    <View style={styles.codeBlock}>
                      <Text>{subsection.code}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        <Text style={styles.watermark}>
          Generated from YourSiteName.com
        </Text>
      </Page>
    </Document>
  );
};
