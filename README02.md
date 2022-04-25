## 04 React + Laravel で認証処理を行う

- `$ mkdir resources/ts`を実行<br>

* `$ mikdir resources/ts/views`を実行<br>

* `$ touch server/resources/ts/views/{Top.tsx ,Register.tsx,Login.tsx,Home.tsx}`を実行<br>

- `resources/ts/views/Top.tsx`を編集<br>

```tsx:Top.tsx
import React from 'react'
import { Link } from 'react-router-dom'

export const Top = () => {
  return (
    <div className="p-4">
      <ul>
        <li>
          <Link to="/register">登録</Link>
        </li>
        <li>
          <Link to="/login">ログイン</Link>
        </li>
        <li>
          <Link to="/home">ホーム</Link>
        </li>
      </ul>
    </div>
  )
}
```

- `resources/ts/views/Register.tsx`を編集<br>

```tsx:Register.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import { LoadingButton } from '@mui/lab'

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

  const onSubmit = (data: EmailAndPasswordData) => {
    setLoading(true)
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios
        .post('/api/register', data)
        .then(() => {
          history.push('home')
        })
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

  const onSubmit = (data: LoginData) => {
    setLoading(true)
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios
        .post('/api/login', data)
        .then(() => {
          history.push('home')
        })
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

export const Home = () => {
  const history = useHistory()
  const logout = () => {
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post('/api/logout', {}).then(() => {
        history.push('/login')
      })
    })
  }

  return (
    <div className="p-4">
      <h1>Home</h1>
      <Button variant="contained" onClick={logout}>
        ログアウト
      </Button>
      {/* アカウント情報を書く */}
    </div>
  )
}
```

- `$ touch resources/ts/app.tsx`を実行<br>

* `resources/ts/app.tsx`を編集<br>

```tsx:app.tsx
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { Top } from './views/Top'
import { Register } from './views/Register'
import { Login } from './views/Login'
import { Home } from './views/Home'

export const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" exact component={Top} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route path="/home" exact component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
```
