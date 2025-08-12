import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClanTab() {
  return (
    <SafeAreaView style={styles.container} data-id="tab-clan">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FABRICBOT ECOSYSTEM</Text>
        </View>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600' }}
            style={styles.mainImage}
          />
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          <Text style={styles.contentText} data-id="ecosystem-text">
            Soon we will tell you how to use this, but for now it's on pause.
          </Text>
          <Text style={styles.contentSubtext}>
            We are working on creating a unique ecosystem for creators and entrepreneurs. 
            Stay tuned for updates!
          </Text>
          
          <View style={styles.pauseBadge}>
            <Text style={styles.pauseBadgeText}>On Pause</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  contentSubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  pauseBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  pauseBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
  },
});