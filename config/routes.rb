require 'sidekiq/web'

Rails.application.routes.draw do
  resources :channels
  draw :madmin
  get '/privacy', to: 'home#privacy'
  get '/terms', to: 'home#terms'
authenticate :user, lambda { |u| u.admin? } do
  mount Sidekiq::Web => '/sidekiq'

  namespace :madmin do
    resources :impersonates do
      post :impersonate, on: :member
      post :stop_impersonating, on: :collection
    end
  end
end

  resources :notifications, only: [:index]
  resources :announcements, only: [:index]
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  root to: 'channels#index'
  resources :channels do
    resources :messages
    resources :channel_users, only: [:create, :destroy]
  end

  namespace :api do
    namespace :v1 do
      resources :channels, only: [] do
        member do
          get :unreads_amount
        end
      end
    end
  end  
end
