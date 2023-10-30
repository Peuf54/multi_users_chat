class Channel < ApplicationRecord
    has_many :channel_users
    has_many :users, through: :channel_users
    has_many :messages, dependent: :destroy

    validates :name, presence: true, uniqueness: true

    def displayable_messages
        messages.where(display: true).order(created_at: :asc)
    end
end
