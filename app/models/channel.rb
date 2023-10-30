class Channel < ApplicationRecord
    has_many :channel_users
    has_many :users, through: :channel_users
    has_many :messages, dependent: :destroy

    validates :name, presence: true, uniqueness: true

    def displayable_messages
        messages.where(display: true).order(created_at: :asc)
    end

    def unreads_amount(user)
        return 0 unless user
        last_read_at = user.channel_users.find_by(channel_id: id)&.last_read_at
        messages = self.messages.where.not(user: user).where(display: true)
        messages.where("created_at > ?", last_read_at || "1900-01-01 00:00:00").count
    end
end
