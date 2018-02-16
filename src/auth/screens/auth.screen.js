import React from 'react';
import {
	View,
	StyleSheet,
	Linking,
	WebView,
	Platform,
} from 'react-native';
import styled from 'styled-components';
import { Button } from 'react-native-elements';
import { colors } from '../../config'

export const CLIENT_ID = '87c7f05700c052937cfb';
export const CLIENT_SECRET = '3a70aee4d5e26c457720a31c3efe2f9062a4997a';
let stateRandom = Math.random().toString();

const SignInContainer = styled.View`
	flex: 1;
	padding-top: 20;
	background-color: #1f2327;
`;

const BrowserSection = styled.View`
	flex: 5;
`;

const ContentSection = styled.View`
	flex: 2;
	justify-content: center;
	align-items: center;
`;

const StyledButton = styled(Button).attrs({
	buttonStyle: {
		backgroundColor: colors.transparent,
		borderRadius: 5,
		borderWidth: 2,
		borderColor: colors.white,
		paddingVertical: 10,
		paddingHorizontal: 30,
		shadowColor: colors.transparent,
	},
	textStyle: {
		fontSize: 12,
	}
}) ``;

export default class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	handleOpenURL = ({ url }) => {
		if (url && url.substring(0, 12) === 'gitgistrn://') {
			const [, queryStringFromUrl] = url.match(/\?(.*)/);
			const { state, code } = queryString.parse(queryStringFromUrl);
			const { auth, getUser, navigation } = this.props;

			if (stateRandom === state) {
				this.setState({
					code,
					showLoader: true,
					loaderText: 'Please wait...',
				});

				stateRandom = Math.random().toString();

				CookieManager.clearAll().then(() => {
					auth(code, state).then(() => {
						getUser().then(() => {
							resetNavigationTo('Main', navigation);
						});
					});
				});
			}
		}
	}

	componentDidMount() {
		if (this.props.isAuthenticated) {
			this.props.navigation.navigate('Main');
		} else {
			if (Platform.OS === 'android') {
				Linking.addEventListener('url', this.handleOpenURL);
				Linking.getInitialURL().then(url => {
					if (url) {
						this.handleOpenURL({ url });
					}
				});
			}
		}
	}

	render() {
		return (
			<SignInContainer>
				<BrowserSection>
					<WebView
						source={{
							uri: `https://github.com/login/oauth/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=gitpoint://welcome&scope=user%20repo&state=${stateRandom}`,
						}}
						// onLoadStart={e => this.toggleCancelButton(e, true)}
						// onLoadEnd={e => this.toggleCancelButton(e, false)}
						// onNavigationStateChange={e => this.onNavigationStateChange(e)}
						// renderLoading={() => this.renderLoading()}
						startInLoadingState
						javaScriptEnabled
					/>
				</BrowserSection>
				<ContentSection>
					<StyledButton
						title="Cancel"
						disabled={this.state.cancelDisabled}
						onPress={() => { }}
					/>
				</ContentSection>
			</SignInContainer>
		)
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			Linking.removeEventListener('url', this.handleOpenURL);
		}
	}
};