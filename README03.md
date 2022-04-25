## 05 認証とアクセス制限

- `$ touch resources/ts/views/AuthContext.tsx`を実行<br>

* `resources/ts/views/AuthContext.tsx`を編集<br>

```tsx:AuthContext.tsx
import axios, { AxiosResponse } from 'axios'
import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { Route, Redirect, useHistory } from 'react-router-dom'

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  two_factor_recovery_codes: string | null
  two_factor_secret: string | null
  created_at: string
  updated_at: string | null
}
interface LoginData {
  email: string
  password: string
}
interface RegisterData {
  email: string
  password: string
  password_confirmation: string
}
interface ProfileData {
  name?: string
  email?: string
}
interface authProps {
  user: User | null
  register: (registerData: RegisterData) => Promise<void>
  signin: (loginData: LoginData) => Promise<void>
  signout: () => Promise<void>
  saveProfile: (formData: FormData | ProfileData) => Promise<void>
}
interface Props {
  children: ReactNode
}
interface RouteProps {
  children: ReactNode
  path: string
  exact?: boolean
}
interface From {
  from: Location
}

const authContext = createContext<authProps | null>(null)

const ProvideAuth = ({ children }: Props) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
export default ProvideAuth

export const useAuth = () => {
  return useContext(authContext)
}

const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null)

  const register = (registerData: RegisterData) => {
    return axios.post('/api/register', registerData).then((res) => {
      axios.get('api/user').then((res) => {
        setUser(res.data)
      })
    })
  }

  const signin = async (loginData: LoginData) => {
    try {
      const res = await axios.post('/api/login', loginData)
    } catch (error) {
      throw error
    }

    return axios
      .get('/api/user')
      .then((res) => {
        setUser(res.data)
      })
      .catch((error) => {
        setUser(null)
      })
  }

  const signout = () => {
    return axios.post('/api/logout', {}).then(() => {
      setUser(null)
    })
  }

  const saveProfile = async (formData: FormData | ProfileData) => {
    const res = await axios
      .post('/api/user/profile-information', formData, {
        headers: { 'X-HTTP-Method-Override': 'PUT' },
      })
      .catch((error) => {
        throw error
      })
    if (res?.status == 200) {
      return axios
        .get('/api/user')
        .then((res) => {
          setUser(res.data)
        })
        .catch((error) => {
          setUser(null)
        })
    }
  }

  useEffect(() => {
    axios
      .get('/api/user')
      .then((res) => {
        setUser(res.data)
      })
      .catch((error) => {
        setUser(null)
      })
  }, [])

  return {
    user,
    register,
    signin,
    signout,
    saveProfile,
  }
}

/**
 * 認証済みのみアクセス可能
 */
export const PrivateRoute = ({ children, path, exact = false }: RouteProps) => {
  const auth = useAuth()
  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if (auth?.user == null) {
          return (
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
          )
        } else {
          return children
        }
      }}
    />
  )
}

/**
 * 認証していない場合のみアクセス可能（ログイン画面など）
 */
export const PublicRoute = ({ children, path, exact = false }: RouteProps) => {
  const auth = useAuth()
  const history = useHistory()
  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if (auth?.user == null) {
          return children
        } else {
          return (
            <Redirect
              to={{
                pathname: (history.location.state as From)
                  ? (history.location.state as From).from.pathname
                  : '/',
                state: { from: location },
              }}
            />
          )
        }
      }}
    />
  )
}
```

- `resources/ts/app.tsx`を編集<br>

```tsx:app.tsx
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { Top } from './views/Top'
import { Register } from './views/Register'
import { Login } from './views/Login'
import { Home } from './views/Home'
import ProvideAuth, { PrivateRoute, PublicRoute } from './views/AuthContext'

export const App = () => {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" exact>
              <Top />
            </Route>
            <PublicRoute path="/register" exact>
              <Register />
            </PublicRoute>
            <PublicRoute path="/login" exact>
              <Login />
            </PublicRoute>
            <PrivateRoute path="/home" exact>
              <Home />
            </PrivateRoute>
          </Switch>
        </div>
      </BrowserRouter>
    </ProvideAuth>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
```

- `resources/ts/views/Register.tsx`を編集<br>

```tsx:Register.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import { LoadingButton } from '@mui/lab'
import { useAuth } from './AuthContext' // 追加

interface EmailAndPasswordData {
  email: string
  password: string
  password_confirmation: string
}

export const Register = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const auth = useAuth() // 追加

  const onSubmit = (data: EmailAndPasswordData) => {
    setLoading(true)
    axios.get('/sanctum/csrf-cookie').then(() => {
      // 編集
      auth
        ?.register(data)
        .then(() => {
          history.push('home')
        })
        // ここまで
        .catch((error) => {
          console.log(error)
          setError('submit', {
            type: 'manual',
            message: '登録に失敗しました。再度登録をしてください',
          })
          setLoading(false)
        })
    })
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
      <h1 className="text-center text-xl font-bold">アカウント作成</h1>
      <p className="text-center">
        <Link to="/login" className="text-sm c-link">
          アカウントを持っている方はこちら
        </Link>
      </p>
      <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="py-4">
          <TextField
            fullWidth
            variant="outlined"
            label="名前"
            {...register('name', {
              required: '入力してください',
            })}
          />
          {errors.name && (
            <span className="block text-red-400">{errors.name.message}</span>
          )}
        </div>
        <div className="py-4">
          <TextField
            fullWidth
            variant="outlined"
            label="メールアドレス"
            {...register('email', {
              required: '入力してください',
            })}
          />
          {errors.email && (
            <span className="block text-red-400">{errors.email.message}</span>
          )}
        </div>
        <div className="py-4">
          <TextField
            fullWidth
            id="password"
            type="password"
            variant="outlined"
            label="パスワード"
            {...register('password', {
              required: '入力してください',
              minLength: {
                value: 8,
                message: '8文字以上で入力してください',
              },
            })}
          />
          {errors.password && (
            <span className="block text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="py-4">
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="パスワード確認"
            {...register('password_confirmation', {
              required: '入力してください',
              validate: {
                match: (value) =>
                  value ===
                    (document.getElementById('password') as HTMLInputElement)
                      .value || 'パスワードが一致しません',
              },
            })}
          />
          {errors.password_confirmation && (
            <span className="block text-red-400">
              {errors.password_confirmation.message}
            </span>
          )}
        </div>
        <div>
          <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            fullWidth
          >
            アカウントを作成する
          </LoadingButton>
          {errors.submit && (
            <span className="block text-red-400">{errors.submit.message}</span>
          )}
        </div>
      </form>
    </div>
  )
}
```

- `resources/ts/views/Login.tsx`を編集<br>

```tsx:Login.tsx
import { LoadingButton } from '@mui/lab'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from './AuthContext' // 追加

interface LoginData {
  email: string
  password: string
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const auth = useAuth() // 追加

  const onSubmit = (data: LoginData) => {
    setLoading(true)
    axios.get('/sanctum/csrf-cookie').then(() => {
      // 編集
      auth
        ?.signin(data)
        .then(() => {
          history.push('home')
        })
        // ここまで
        .catch((error) => {
          console.log(error)
          setError('submit', {
            type: 'manual',
            message: 'ログインに失敗しました',
          })
          setLoading(false)
        })
    })
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
      <h1 className="text-center text-xl font-bold pb-4">ログイン</h1>
      <p className="text-center">
        <Link to="/register" className="text-sm c-link">
          アカウントを持っていない方はこちら
        </Link>
      </p>
      <form
        className="py-4"
        onSubmit={(e) => {
          clearErrors()
          handleSubmit(onSubmit)(e)
        }}
      >
        <div className="py-4">
          <TextField
            fullWidth
            variant="outlined"
            label="メールアドレス"
            {...register('email', {
              required: '入力してください',
            })}
          />
          {errors.email && (
            <span className="block text-red-400">{errors.email.message}</span>
          )}
        </div>
        <div className="py-4">
          <TextField
            fullWidth
            id="password"
            type="password"
            variant="outlined"
            label="パスワード"
            {...register('password', {
              required: '入力してください',
            })}
          />
          {errors.password && (
            <span className="block text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="text-center">
          <div>
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              fullWidth
            >
              Login
            </LoadingButton>
          </div>
          {errors.submit && (
            <span className="block text-red-400">{errors.submit.message}</span>
          )}
        </div>
      </form>
    </div>
  )
}
```

- `resources/ts/views/Home.tsx`を編集<br>

```tsx:Home.tsx
import { Button } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useHistory } from 'react-router'
import { useAuth } from './AuthContext' // 追加

export const Home = () => {
  const history = useHistory()
  const auth = useAuth() // 追加

  const logout = () => {
    axios.get('/sanctum/csrf-cookie').then(() => {
      // 編集
      auth?.signout().then(() => {
        history.push('/login')
      })
      // ここまで
    })
  }

  return (
    <div className="p-4">
      <h1>Home</h1>
      {/* 追加 */}
      <p>Hello! {auth?.user?.name}</p>
      <Button variant="contained" onClick={logout}>
        ログアウト
      </Button>
      {/* アカウント情報を書く */}
    </div>
  )
}
```
