import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native'
import Text from './Text'
import LibraryContext from '../LibraryContext'

type Props = React.ComponentProps<typeof TextInput> & {
  label: string
  errorText?: string | null
  endEnhancer?: React.ReactNode
}

const TextField = React.forwardRef<TextInput, Props>((props, ref) => {
  const {
    label,
    errorText,
    value,
    endEnhancer,
    style,
    onBlur,
    onFocus,
    ...restOfProps
  } = props
  const { inputColors = {}, fonts, overrides } = useContext(LibraryContext)
  const {
    errored: errorColor = '#ff0000',
    focused: focusedColor = '#2f2e2e',
    regular: regularColor = '#666666',
  } = inputColors

  const [isFocused, setIsFocused] = useState(false)

  const focusAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.9, 1),
      useNativeDriver: true,
    }).start()
  }, [focusAnim, isFocused, value])

  let color = isFocused ? focusedColor : regularColor
  if (errorText) {
    color = errorColor
  }

  return (
    <View style={style}>
      <TextInput
        style={[
          styles.input,
          {
            fontFamily: fonts.regular,
          },
          overrides.input,
          {
            borderColor: color,
          },
        ]}
        ref={ref}
        {...restOfProps}
        value={value}
        onBlur={(event) => {
          setIsFocused(false)
          onBlur?.(event)
        }}
        onFocus={(event) => {
          setIsFocused(true)
          onFocus?.(event)
        }}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          // @ts-ignore
          ref?.current?.focus()
        }}
      >
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                {
                  scale: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.70],
                  }),
                },
                {
                  translateY: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [7, -27],
                  }),
                },
                {
                  translateX: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -label?.length * 1.5],
                  }),
                },
              ],
            },
            overrides.labelContainer,
          ]}
        >
          <Text
            style={[
              styles.label,
              overrides.inputLabel,
              {
                color,
              },
            ]}
            bold
          >
            {label}
            {errorText ? '*' : ''}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      {endEnhancer && (
        <View style={styles.enhancerContainer}>{endEnhancer}</View>
      )}
      <Text style={[styles.error, overrides.errorText]}>{errorText}</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderBottomWidth: 1,
    fontSize: 17,
    includeFontPadding: false,
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: 'white',
  },
  label: {
    paddingTop: 6,
    fontSize: 15,
  },
  enhancerContainer: {
    position: 'absolute',
    right: 0,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
})

export default TextField
