module Api
    module V1
        class ChannelsController < ApplicationController
            before_action :authenticate_user!
            before_action :set_channel

            def unreads_amount
                render json: { unreads_amount: @channel.unreads_amount(current_user) }
            end

            private

            def set_channel
                @channel = current_user.channels.find(params[:id])
            end
        end
    end
end