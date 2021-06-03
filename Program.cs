using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

//variant 2
namespace Lab1
{
    class Program
    {
        private static string _nick;
        private static EndPoint _remotePoint;
        private static readonly Socket Socket = new(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
        private static string id;
        private static string guestId;
        private const char SeparatorStick = '|';
        private static string _ip;
        private static string _port;
        private static Dictionary<string, List<string>> _messagesHistory = new();

        private static void StartPage()
        {
            try
            {
                Console.Clear();
                Console.WriteLine("Enter your nickname!");
                _nick = Console.ReadLine();
                Console.Clear();
                Console.WriteLine("Hello, " + _nick);
                Console.WriteLine("Enter your port");
                var myPort = Convert.ToInt32(Console.ReadLine());
                Console.WriteLine("Enter ip of your companion");
                _ip = Console.ReadLine();
                Console.WriteLine("Enter port of your companion");
                _port = Console.ReadLine();
                Console.WriteLine("Do u already have your id? Y/any other");
                if (Console.ReadLine() == "Y")
                {
                    Console.WriteLine("Write your id");
                    try
                    {
                        id = Console.ReadLine();
                    }
                    catch (Exception ex)
                    {
                        Error(ex.Message);
                        StartPage();
                    }
                }
                else
                {
                    id = Guid.NewGuid().ToString("N").Substring(0, 5);
                    Console.WriteLine($"Here is your generated id:\n{id}");
                    Console.ReadKey();
                }

                Socket.Bind(new IPEndPoint(IPAddress.Parse("127.0.0.1"), myPort));
                _remotePoint = new IPEndPoint(IPAddress.Parse(_ip), int.Parse(_port));

                var data = Encoding.Unicode.GetBytes($"|connected--" + id);
                Socket.SendTo(data, _remotePoint);
                Console.WriteLine();
                Console.Clear();
            }
            catch
            {
                Error("Wrong format");
                Thread.Sleep(1500);
                StartPage();
            }
        }

        private static void ReceiveMessages()
        {
            try
            {
                while (true)
                {
                    StringBuilder value = new();
                    var data = new byte[256];
                    do
                    {
                        var bytes = Socket.ReceiveFrom(data, ref _remotePoint);
                        value.Append(Encoding.Unicode.GetString(data, 0, bytes));
                    } while (Socket.Available > 0);

                    if (!value.ToString().Contains("|"))
                    {
                        guestId = value.ToString();
                        _messagesHistory[guestId] = new List<string>();
                    }

                    if (value.ToString().Split("--")[0] == "|connected" && value.ToString().Contains("|"))
                    {
                        if (_messagesHistory.ContainsKey(value.ToString().Split("--")[1])
                            && _messagesHistory.Count != 0)
                        {
                            SendHistory();
                        }
                        else
                        {
                            _messagesHistory[value.ToString().Split("--")[1]] = new List<string>();
                            Console.Clear();
                        }

                        guestId = value.ToString().Split("--")[1];
                    }
                    else if (value.ToString().Split("--")[0] != "|connected" && value.ToString().Contains("|"))
                    {
                        if (guestId == null)
                        {
                            var i = 0;
                            while (value[i] != SeparatorStick)
                            {
                                guestId += value[i];
                                i++;
                            }
                        }

                        if (_messagesHistory.ContainsKey(guestId))
                        {
                            _messagesHistory[guestId].Add(value.ToString());
                        }
                        else
                        {
                            _messagesHistory[guestId] = new List<string>() {value.ToString()};
                        }

                        DisplayMessages();
                    }
                }
            }
            catch (Exception ex)
            {
                ReceiveMessages();
            }
        }

        private static void SendMessage()
        {
            while (true)
            {
                if (guestId != null)
                {
                    var messageText = Console.ReadLine();
                    var message = _nick + ": " + messageText;
                    var data = Encoding.Unicode.GetBytes(id + SeparatorStick + message);
                    Socket.SendTo(data, _remotePoint);
                    _messagesHistory[$"{guestId}"].Add(id + SeparatorStick + message);
                    DisplayMessages();
                }
                else
                {
                    Console.Clear();
                    Console.WriteLine("Second user is not connected");
                    Thread.Sleep(300);
                }
            }
        }

        private static void Error(string errorMessage)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Error. " + errorMessage);
            Console.ResetColor();
        }

        private static void DisplayMessages()
        {
            Console.Clear();
            Console.WriteLine("My id: " + id);
            try
            {
                foreach (var pair in _messagesHistory.Where(p => p.Key == guestId))
                {
                    foreach (var mes in pair.Value)
                    {
                        Console.WriteLine(mes.Split("|")[1]);
                    }
                }
            }
            catch
            {
                Error("Fail");
            }
        }

        private static void SendHistory()
        {
            Socket.SendTo(Encoding.Unicode.GetBytes(id), _remotePoint);
            foreach (var pair in _messagesHistory.Where(p => p.Key == guestId))
            {
                foreach (var data in pair.Value.Select(mes => Encoding.Unicode.GetBytes(mes)))
                {
                    Socket.SendTo(data, _remotePoint);
                    Thread.Sleep(50);
                }
            }
        }

        static void Main(string[] args)
        {
            StartPage();
            Thread receive = new(ReceiveMessages);
            receive.Start();
            Thread send = new(SendMessage);
            send.Start();
        }
    }
}