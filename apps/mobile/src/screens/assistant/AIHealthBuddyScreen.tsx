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
import {
  ArrowLeft,
  Sparkles,
  Send,
  Trash2,
  ShieldAlert,
  Bot
} from 'lucide-react-native';

export const AIHealthBuddyScreen: React.FC<{ route?: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isThinking, suggestedPrompts } = useSelector(
    (state: RootState) => state.assistant
  );
  const { user } = useSelector((state: RootState) => state.auth);

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <Sparkles size={16} color={colors.accentPurple} />
            <Text style={styles.headerTitle}>AI HEALTH BUDDY</Text>
          </View>
          <Text style={styles.headerSubtitle}>Grounded in Alex Morgan's Health Data</Text>
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
            <ShieldAlert size={14} color={colors.textMuted} />
            <Text style={styles.safetyText}>
              Grounded AI health awareness assistant. Always consult your qualified healthcare provider for clinical diagnosis and emergency care.
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
              <ActivityIndicator size="small" color={colors.accentPurple} />
              <Text style={styles.thinkingText}>AI Health Buddy is reviewing your medical parameters...</Text>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Suggested Quick Prompts Horizontal Scroll */}
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
                  <Sparkles size={12} color={colors.primary} />
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about your lab results, medications..."
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
            <Send size={18} color="#FFFFFF" />
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
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
    ...typography.label,
    fontSize: 13,
    color: colors.textPrimary,
    letterSpacing: 1,
    marginLeft: 6
  },
  headerSubtitle: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageList: {
    paddingVertical: spacing.md
  },
  safetyDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  safetyText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: spacing.xs + 2,
    flex: 1,
    lineHeight: 14
  },
  thinkingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)'
  },
  thinkingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm
  },
  promptsBar: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  promptsScroll: {
    paddingHorizontal: spacing.lg
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    marginRight: spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)'
  },
  promptChipText: {
    ...typography.captionSemibold,
    color: colors.textPrimary,
    marginLeft: 4,
    fontSize: 11
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accentPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceHover,
    opacity: 0.5
  }
});
