class MessagesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_channel

    def create
        @message = @channel.messages.new(message_params)
        @message.save
        MessageChannel.broadcast_to @channel, message: render_to_string(@message)
    end

    private

    def set_channel
        @channel = current_user.channels.find(params[:channel_id])
    end

    def message_params
        params.require(:message).permit(:body).merge(user: current_user)
    end
end