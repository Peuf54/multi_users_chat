class Message < ApplicationRecord
  belongs_to :channel
  belongs_to :user

  validates :body, presence: true
  validates :body, length: { minimum: 1, maximum: 300 }
end
