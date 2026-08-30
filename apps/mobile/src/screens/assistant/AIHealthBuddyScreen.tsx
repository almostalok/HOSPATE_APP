import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { sendMessageAsync, clearChat } from '../../store/assistantSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { AIMessage } from '../../components/AIMessage';
import { HospateLogo } from '../../components/HospateLogo';
import { ArrowLeft, Send, Trash2, Shield } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AIHealthBuddyScreen: React.FC<{ route?: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isThinking, suggestedPrompts } = useSelector(
    (state: RootState) => state.assistant
  );

  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const initialPrompt = route?.params?.initialPrompt;

  useEffect(() => {
    if (initialPrompt) {
      dispatch(sendMessageAsync(initialPrompt));
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    setInputMessage('');
    dispatch(sendMessageAsync(query));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Apple Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 36) + 8, paddingBottom: spacing.sm + 2 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <HospateLogo size={20} />
            <Text style={styles.headerTitle}>Health Buddy</Text>
          </View>
          <Text style={styles.headerSubtitle}>Grounded in your medical records</Text>
        </View>

        <TouchableOpacity style={styles.clearBtn} onPress={() => dispatch(clearChat())}>
          <Trash2 size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        {/* Messages Feed */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        >
          {/* Medical Safety Disclaimer Pill */}
          <View style={styles.safetyDisclaimer}>
            <Shield size={14} color={colors.textMuted} />
            <Text style={styles.safetyText}>
              Grounded health intelligence assistant. Not intended for diagnosis or emergency triage. Always consult your qualified physician.
            </Text>
          </View>

          {messages.map((msg) => (
            <AIMessage
              key={msg.id}
              message={msg}
              onSelectPrompt={handleSend}
            />
          ))}

          {isThinking && (
            <View style={styles.thinkingBox}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.thinkingText}>Reviewing your health parameters...</Text>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Suggested Quick Prompts */}
        {suggestedPrompts.length > 0 && !isThinking && (
          <View style={styles.promptsBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
              {suggestedPrompts.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => handleSend(p)}
                  style={styles.promptChip}
                >
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Apple iOS Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about lab results, vitals, medications..."
            placeholderTextColor={colors.textMuted}
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline={false}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSend()}
            disabled={!inputMessage.trim() || isThinking}
            style={[
              styles.sendButton,
              (!inputMessage.trim() || isThinking) && styles.sendButtonDisabled
            ]}
          >
            <Send size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerCenter: {
    alignItems: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 6
  },
  headerSubtitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageList: {
    paddingVertical: spacing.md
  },
  safetyDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  safetyText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: spacing.xs + 2,
    flex: 1,
    lineHeight: 16
  },
  thinkingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  thinkingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm
  },
  promptsBar: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  promptsScroll: {
    paddingHorizontal: spacing.lg
  },
  promptChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.pill,
    marginRight: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  promptChipText: {
    ...typography.captionSemibold,
    color: colors.textPrimary,
    fontSize: 12
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.5
  }
});
