import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Appear } from './transitions';
import { withRoomContext } from '../RoomContext';
import * as stateActions from '../redux/stateActions';

class Stats extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state =
		{
			sendTransportRemoteStats : null,
			sendTransportLocalStats  : null,
			recvTransportRemoteStats : null,
			recvTransportLocalStats  : null,
			audioProducerRemoteStats : null,
			audioProducerLocalStats  : null,
			videoProducerRemoteStats : null,
			videoProducerLocalStats  : null,
			dataProducerRemoteStats  : null,
			audioConsumerRemoteStats : null,
			audioConsumerLocalStats  : null,
			videoConsumerRemoteStats : null,
			videoConsumerLocalStats  : null,
			dataConsumerRemoteStats  : null
		};

		this._delayTimer = null;
	}

	render()
	{
		const {
			peerId,
			peerDisplayName,
			isMe,
			onClose
		} = this.props;

		const {
			sendTransportRemoteStats,
			sendTransportLocalStats,
			recvTransportRemoteStats,
			recvTransportLocalStats,
			audioProducerRemoteStats,
			audioProducerLocalStats,
			videoProducerRemoteStats,
			videoProducerLocalStats,
			dataProducerRemoteStats,
			audioConsumerRemoteStats,
			audioConsumerLocalStats,
			videoConsumerRemoteStats,
			videoConsumerLocalStats,
			dataConsumerRemoteStats
		} = this.state;

		return (
			<div data-component='Stats'>
				<div className={classnames('content', { visible: peerId })}>
					<div className='header'>
						<div className='info'>
							<div
								className='close-icon'
								onClick={onClose}
							/>

							<Choose>
								<When condition={isMe}>
									<h1>Your Stats</h1>
								</When>

								<Otherwise>
									<h1>Stats of {peerDisplayName}</h1>
								</Otherwise>
							</Choose>
						</div>

						<div className='list'>
							<If condition={sendTransportRemoteStats || sendTransportLocalStats}>
								<p>
									{'send transport stats: '}
									<a href='#send-transport-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a href='#send-transport-local-stats'>[local]</a>
								</p>
							</If>

							<If condition={recvTransportRemoteStats || recvTransportLocalStats}>
								<p>
									{'recv transport stats: '}
									<a href='#recv-transport-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a href='#recv-transport-local-stats'>[local]</a>
								</p>
							</If>

							<If condition={audioProducerRemoteStats || audioProducerLocalStats}>
								<p>
									{'audio stats: '}
									<a href='#audio-producer-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a href='#audio-producer-local-stats'>[local]</a>
								</p>
							</If>

							<If condition={videoProducerRemoteStats || videoProducerLocalStats}>
								<p>
									{'video stats: '}
									<a href='#video-producer-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a href='#video-producer-local-stats'>[local]</a>
								</p>
							</If>

							<If condition={dataProducerRemoteStats}>
								<p>
									{'data stats: '}
									<a href='#data-producer-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a className='disabled'>[local]</a>
								</p>
							</If>

							<If condition={audioConsumerRemoteStats || audioConsumerLocalStats}>
								<p>
									{'audio stats: '}
									<a href='#audio-consumer-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a href='#audio-consumer-local-stats'>[local]</a>
								</p>
							</If>

							<If condition={videoConsumerRemoteStats || videoConsumerLocalStats}>
								<p>
									{'video stats: '}
									<a href='#video-consumer-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a href='#video-consumer-local-stats'>[local]</a>
								</p>
							</If>

							<If condition={dataConsumerRemoteStats}>
								<p>
									{'data stats: '}
									<a href='#data-consumer-remote-stats'>[remote]</a>
									<span>{' '}</span>
									<a className='disabled'>[local]</a>
								</p>
							</If>
						</div>
					</div>

					<div className='stats'>
						<If condition={sendTransportRemoteStats}>
							{this._printStats('send transport remote stats', sendTransportRemoteStats)}
						</If>

						<If condition={sendTransportLocalStats}>
							{this._printStats('send transport local stats', sendTransportLocalStats)}
						</If>

						<If condition={recvTransportRemoteStats}>
							{this._printStats('recv transport remote stats', recvTransportRemoteStats)}
						</If>

						<If condition={recvTransportLocalStats}>
							{this._printStats('recv transport local stats', recvTransportLocalStats)}
						</If>

						<If condition={audioProducerRemoteStats}>
							{this._printStats('audio producer remote stats', audioProducerRemoteStats)}
						</If>

						<If condition={audioProducerLocalStats}>
							{this._printStats('audio producer local stats', audioProducerLocalStats)}
						</If>

						<If condition={videoProducerRemoteStats}>
							{this._printStats('video producer remote stats', videoProducerRemoteStats)}
						</If>

						<If condition={videoProducerLocalStats}>
							{this._printStats('video producer local stats', videoProducerLocalStats)}
						</If>

						<If condition={dataProducerRemoteStats}>
							{this._printStats('data producer remote stats', dataProducerRemoteStats)}
						</If>

						<If condition={audioConsumerRemoteStats}>
							{this._printStats('audio consumer remote stats', audioConsumerRemoteStats)}
						</If>

						<If condition={audioConsumerLocalStats}>
							{this._printStats('audio consumer local stats', audioConsumerLocalStats)}
						</If>

						<If condition={videoConsumerRemoteStats}>
							{this._printStats('video consumer remote stats', videoConsumerRemoteStats)}
						</If>

						<If condition={videoConsumerLocalStats}>
							{this._printStats('video consumer local stats', videoConsumerLocalStats)}
						</If>

						<If condition={dataConsumerRemoteStats}>
							{this._printStats('data consumer remote stats', dataConsumerRemoteStats)}
						</If>
					</div>
				</div>
			</div>
		);
	}

	componentDidUpdate(prevProps)
	{
		const { peerId } = this.props;

		if (peerId && !prevProps.peerId)
		{
			this._delayTimer = setTimeout(() => this._start(), 250);
		}
		else if (!peerId && prevProps.peerId)
		{
			this._stop();
		}
		else if (peerId && prevProps.peerId && peerId !== prevProps.peerId)
		{
			this._stop();
			this._start();
		}
	}

	async _start()
	{
		const {
			roomClient,
			isMe,
			audioConsumerId,
			videoConsumerId,
			dataConsumerId
		} = this.props;

		let sendTransportRemoteStats = null;
		let sendTransportLocalStats = null;
		let recvTransportRemoteStats = null;
		let recvTransportLocalStats = null;
		let audioProducerRemoteStats = null;
		let audioProducerLocalStats = null;
		let videoProducerRemoteStats = null;
		let videoProducerLocalStats = null;
		let dataProducerRemoteStats = null;
		let audioConsumerRemoteStats = null;
		let audioConsumerLocalStats = null;
		let videoConsumerRemoteStats = null;
		let videoConsumerLocalStats = null;
		let dataConsumerRemoteStats = null;

		if (isMe)
		{
			sendTransportRemoteStats = await roomClient.getSendTransportRemoteStats()
				.catch(() => {});

			sendTransportLocalStats = await roomClient.getSendTransportLocalStats()
				.catch(() => {});

			audioProducerRemoteStats = await roomClient.getAudioRemoteStats()
				.catch(() => {});

			audioProducerLocalStats = await roomClient.getAudioLocalStats()
				.catch(() => {});

			videoProducerRemoteStats = await roomClient.getVideoRemoteStats()
				.catch(() => {});

			videoProducerLocalStats = await roomClient.getVideoLocalStats()
				.catch(() => {});

			dataProducerRemoteStats = await roomClient.getDataProducerRemoteStats()
				.catch(() => {});
		}
		else
		{
			recvTransportRemoteStats = await roomClient.getRecvTransportRemoteStats()
				.catch(() => {});

			recvTransportLocalStats = await roomClient.getRecvTransportLocalStats()
				.catch(() => {});

			audioConsumerRemoteStats = await roomClient.getConsumerRemoteStats(audioConsumerId)
				.catch(() => {});

			audioConsumerLocalStats = await roomClient.getConsumerLocalStats(audioConsumerId)
				.catch(() => {});

			videoConsumerRemoteStats = await roomClient.getConsumerRemoteStats(videoConsumerId)
				.catch(() => {});

			videoConsumerLocalStats = await roomClient.getConsumerLocalStats(videoConsumerId)
				.catch(() => {});

			dataConsumerRemoteStats = await roomClient.getDataConsumerRemoteStats(dataConsumerId)
				.catch(() => {});
		}

		this.setState(
			{
				sendTransportRemoteStats,
				sendTransportLocalStats,
				recvTransportRemoteStats,
				recvTransportLocalStats,
				audioProducerRemoteStats,
				audioProducerLocalStats,
				videoProducerRemoteStats,
				videoProducerLocalStats,
				dataProducerRemoteStats,
				audioConsumerRemoteStats,
				audioConsumerLocalStats,
				videoConsumerRemoteStats,
				videoConsumerLocalStats,
				dataConsumerRemoteStats
			});

		this._delayTimer = setTimeout(() => this._start(), 2500);
	}

	_stop()
	{
		clearTimeout(this._delayTimer);

		this.setState(
			{
				sendTransportRemoteStats : null,
				sendTransportLocalStats  : null,
				recvTransportRemoteStats : null,
				recvTransportLocalStats  : null,
				audioProducerRemoteStats : null,
				audioProducerLocalStats  : null,
				videoProducerRemoteStats : null,
				videoProducerLocalStats  : null,
				dataProducerRemoteStats  : null,
				audioConsumerRemoteStats : null,
				audioConsumerLocalStats  : null,
				videoConsumerRemoteStats : null,
				videoConsumerLocalStats  : null,
				dataConsumerRemoteStats  : null
			});
	}

	_printStats(title, stats)
	{
		const anchor = title
			.replace(/[ ]+/g, '-');

		if (typeof stats.values === 'function')
			stats = Array.from(stats.values());

		return (
			<Appear duration={150}>
				<div className='items'>
					<h2 id={anchor}>{title}</h2>

					{
						stats.map((item, idx) => (
							<div className='item' key={idx}>
								{
									Object.keys(item).map((key) => (
										<div className='line' key={key}>
											<p className='key'>{key}</p>
											<div className='value'>
												<Choose>
													<When condition={typeof item[key] === 'number'}>
														{JSON.stringify(Math.round(item[key] * 100) / 100, null, '  ')}
													</When>

													<Otherwise>
														<pre>{JSON.stringify(item[key], null, '  ')}</pre>
													</Otherwise>
												</Choose>
											</div>
										</div>
									))
								}
							</div>
						))
					}
				</div>
			</Appear>
		);
	}
}

Stats.propTypes =
{
	roomClient      : PropTypes.any.isRequired,
	peerId          : PropTypes.string,
	peerDisplayName : PropTypes.string,
	isMe            : PropTypes.bool,
	audioConsumerId : PropTypes.string,
	videoConsumerId : PropTypes.string,
	dataConsumerId  : PropTypes.string,
	onClose         : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
{
	const { room, me, peers, consumers } = state;
	const { statsPeerId } = room;

	if (!statsPeerId)
		return {};

	const isMe = statsPeerId === me.id;
	const peer = isMe ? me : peers[statsPeerId];
	let audioConsumerId;
	let videoConsumerId;
	let dataConsumerId;

	if (!isMe)
	{
		for (const consumerId of peer.consumers)
		{
			const consumer = consumers[consumerId];

			switch (consumer.track.kind)
			{
				case 'audio':
					audioConsumerId = consumer.id;
					break;

				case 'video':
					videoConsumerId = consumer.id;
					break;
			}
		}

		dataConsumerId = peer.dataConsumers[0];
	}

	return {
		peerId          : peer.id,
		peerDisplayName : peer.displayName,
		isMe,
		audioConsumerId,
		videoConsumerId,
		dataConsumerId
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onClose : () => dispatch(stateActions.setRoomStatsPeerId(null))
	};
};

const StatsContainer = withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps
)(Stats));

export default StatsContainer;
