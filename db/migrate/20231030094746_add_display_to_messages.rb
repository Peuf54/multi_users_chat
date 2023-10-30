class AddDisplayToMessages < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :display, :boolean, default: true
  end
end
