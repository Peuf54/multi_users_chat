class MessagesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_channel

    def create
        @message = @channel.messages.new(message_params)
        @message.save
        if MessageModeratorService.message_approved?(@message)
            MessageChannel.broadcast_to @channel, message: render_to_string(@message), message_user_id: current_user.id
        else
            @message.update(display: false)
            alert_html = render_to_string(partial: "shared/notices", locals: { flash: { alert: "Your message was flagged as inappropriate and was not sent." } })
            MessageChannel.broadcast_to @channel, alert: alert_html
        end
    end

    private

    def set_channel
        @channel = current_user.channels.find(params[:channel_id])
    end

    def message_params
        params.require(:message).permit(:body).merge(user: current_user)
    end
end