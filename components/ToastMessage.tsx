import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface ToastMessageProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  visible: boolean;
  onHide: () => void;
}

export default function ToastMessage({ message, type, visible, onHide }: ToastMessageProps) {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: '#10B981', bgColor: '#ECFDF5' };
      case 'error':
        return { icon: XCircle, color: '#EF4444', bgColor: '#FEF2F2' };
      case 'warning':
        return { icon: AlertCircle, color: '#F59E0B', bgColor: '#FFFBEB' };
      default:
        return { icon: AlertCircle, color: '#6B7280', bgColor: '#F9FAFB' };
    }
  };

  const { icon: Icon, color, bgColor } = getIconAndColor();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, opacity, transform: [{ translateY }] },
      ]}
    >
      <Icon size={20} color={color} strokeWidth={2} />
      <Text style={[styles.message, { color }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
});