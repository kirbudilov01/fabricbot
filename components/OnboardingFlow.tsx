import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Users, Wallet, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 'slide-1',
    icon: Search,
    title: 'Discover creators & offers',
    subtitle: 'Find the best services and connect with talented creators in our marketplace',
    iconColor: '#3B82F6',
    iconBg: '#EBF4FF',
  },
  {
    id: 'slide-2',
    icon: Users,
    title: 'Earn with referral links',
    subtitle: 'Share custom links and earn commissions when others purchase through your referrals',
    iconColor: '#10B981',
    iconBg: '#F0FDF4',
  },
  {
    id: 'slide-3',
    icon: Wallet,
    title: 'Manage payouts in FBC',
    subtitle: 'Track your earnings and manage withdrawals with our secure FBC token system',
    iconColor: '#8B5CF6',
    iconBg: '#F3E8FF',
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentSlide(slideIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      onComplete();
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
      onComplete(); // Continue anyway
    }
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    const { icon: Icon, title, subtitle, iconColor, iconBg } = slide;
    
    return (
      <View key={slide.id} style={styles.slide} data-id={`onboarding-${slide.id}`}>
        <View style={styles.slideContent}>
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Icon size={64} color={iconColor} strokeWidth={1.5} />
          </View>
          
          <Text style={styles.slideTitle}>{title}</Text>
          <Text style={styles.slideSubtitle}>{subtitle}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            currentSlide === index ? styles.activeDot : styles.inactiveDot,
          ]}
          onPress={() => goToSlide(index)}
        />
      ))}
    </View>
  );

  const renderBottomSection = () => {
    const isLastSlide = currentSlide === slides.length - 1;

    return (
      <View style={styles.bottomSection}>
        {renderDots()}
        
        <View style={styles.buttonContainer}>
          {isLastSlide ? (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              data-id="onboarding-cta"
            >
              <Text style={styles.getStartedButtonText}>Get started</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <ChevronRight size={20} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          contentInsetAdjustmentBehavior="never"
          style={styles.scrollView}
        >
          {slides.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>
        
        {renderBottomSection()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  slideSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#3B82F6',
  },
  inactiveDot: {
    backgroundColor: '#E5E7EB',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 24,
    minHeight: 56,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    minHeight: 56,
    minWidth: 140,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 8,
  },
});