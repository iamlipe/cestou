import React from 'react';
import {Provider} from 'react-redux';
import {StatusBar, Text, TextInput} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Routes} from '@/routes';
import {store} from '@/store';
import {theme} from '@/styles';
import {I18nextProvider} from 'react-i18next';
import i18n from './config/i18n';

interface TextWithDefaultProps extends Text {
  defaultProps?: {allowFontScaling?: boolean};
}

interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: {allowFontScaling?: boolean};
}

(Text as unknown as TextWithDefaultProps).defaultProps =
  (Text as unknown as TextWithDefaultProps).defaultProps || {};
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
(Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling =
  false;

(TextInput as unknown as TextInputWithDefaultProps).defaultProps =
  (TextInput as unknown as TextInputWithDefaultProps).defaultProps || {};
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
(
  TextInput as unknown as TextInputWithDefaultProps
).defaultProps!.allowFontScaling = false;

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
              <StatusBar
                barStyle="dark-content"
                animated={false}
                backgroundColor="#6CCD91"
              />
              <Routes />
            </I18nextProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
