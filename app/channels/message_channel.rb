class MessageChannel < ApplicationCable::Channel
  def subscribed
    stop_all_streams
    stream_for Channel.find(params["id"])
  end

  def unsubscribed
    stop_all_streams
  end

  def touch
    current_user.channel_users.find_by(channel_id: params["id"])&.touch(:last_read_at)
  end
end
